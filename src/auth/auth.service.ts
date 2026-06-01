import { UserService } from "./../users/user.service";
import { AuthSignInDto, AuthSignUpDto } from "./dtos/auth.dto";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { MailService } from "src/mailer/mailer.service";
import { ToAddLinkDto } from "./dtos/to-add-link.dto";
import { randomBytes } from "crypto";
import { ResetPassword, VerifyToken } from "./dtos/reset-password.dto";
import { hashPassword } from "src/utils/hashing";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly prisma: PrismaService
  ) {}

  async signIn(data: AuthSignInDto): Promise<{ access_token: string }> {
    const user = await this.userService.findOneByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }
    const comparing = await bcrypt.compare(data.password, user?.password);
    console.log(comparing);
    if (!comparing) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.id,
      email: user.email,
      isAccountVerifed: false,
      teamId: user.teamId
    };
    this.mailService.sendLogin(user.email);
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
  async createLink(data: AuthSignUpDto) {
    try {
      data.password = await hashPassword(data.password);
      const token = Math.floor(100000 * Math.random());
      const { email, name, password } = data;
      const user = await this.prisma.user.create({
        data: { email: email, name: name, password: password },
      });
      const link = this.mailService.generateLink(user.id, "verifyToken");
      this.mailService.sendEmailVerification(user.email, link, token);
      return { link };
    } catch {
      return "sorry some thing wrong";
    }
  }

  async createAndVerify(id: number, token: number) {
    const verify = await this.prisma.verification.findUnique({ where: { id } });
    if (!verify) {
      throw new BadRequestException("no user found");
    }

    if (verify.verificationToken !== token)
      throw new NotFoundException("not valid token");
    return await this.prisma.verification.update({
      where: { id: id },
      data: { verificationToken: null, isAccountVerified: true },
    });
  }

  async sendLink(toAddLink: ToAddLinkDto, jwtToken?: string) {
    const token = randomBytes(32).toString("hex");
    let userId: number = toAddLink.id;
    let userEmail = toAddLink.email;
    if (jwtToken) {
      try {
        const cleanToken = jwtToken.replace("Bearer ", "");
        const { id, email } = await this.jwtService.verifyAsync(cleanToken!, {
          secret: process.env.JWT_SECRET,
        });
        userId = id;
        userEmail = email;
      } catch (err) {
        console.log(err);
        throw new UnauthorizedException("some thing error");
      }
    }

    this.mailService.sendResetPsswordToken(
      userEmail,
      this.mailService.generateLink(toAddLink.id, "auth/verify-reset-password"),
      token,
    );

    await this.prisma.resetPassword.update({
      where: { id: userId },
      data: { resetPasswordToken: token },
    });
    return {
      message: `token has send to ${userEmail.slice(0, 3)} ${"*".repeat(userEmail.length - 3)}`,
    };
  }
  async verifyToken({ id, resetPasswordToken }: VerifyToken) {
    const user = await this.userService.findOneById(id);
    const verify = await this.prisma.resetPassword.findUniqueOrThrow({
      where: { id },
    });
    if (!user) throw new NotFoundException("no account with this id");
    if (verify.resetPasswordToken === resetPasswordToken) {
      await this.prisma.resetPassword.update({
        where: { id },
        data: { allowed: true },
      });
      return {
        message: `you are ready for reset your password in link ${this.mailService.generateLink(id, "auht/reset-password")}`,
      };
    }
  }
  async resetPassword({ id, newPassword }: ResetPassword) {
    const user = await this.userService.findOneById(id);
    const resetPassword = await this.prisma.resetPassword.findUniqueOrThrow({
      where: { id },
    });
    if (!user) throw new NotFoundException("no account with this id");
    if (resetPassword.allowed === true) {
      return await this.prisma.user.update({
        where: { id },
        data: { password: await hashPassword(newPassword) },
      });
    }
  }
}
