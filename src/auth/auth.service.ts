import { UserService } from "./../users/user.service";
import { AuthSignInDto, AuthSignUpDto, EmailDto } from "./dtos/auth.dto";
import {
	BadRequestException,
	ForbiddenException,
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
		private readonly prisma: PrismaService,
	) { }

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
			teamId: user.teamId,
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
			const isExist = await this.prisma.user.findUnique({
				where: { email: data.email },
			});
			if (isExist) throw new BadRequestException("this user is exist before");
			data.password = await hashPassword(data.password);
			const token = Math.floor(900000 * Math.random() + 100000);
			const { email, name, password } = data;
			const user = await this.prisma.user.create({
				data: { email: email, name: name, password: password },
			});
			const verify = await this.prisma.verification.create({
				data: {
					verificationToken: token,
					userId: user.id,
					isAccountVerified: false,
				},
			});

			const link = this.mailService.generateLink(verify.id, "verifyToken");
			await this.mailService.sendEmailVerification(user.email, link, token);
			return { link };
		} catch (err: any) {
			console.error(err);
			throw new BadRequestException("failed , please check srvers log");
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

	async sendLink(toAddLink: ToAddLinkDto) {
		const token = randomBytes(32).toString("hex");
		await this.mailService.sendResetPsswordToken(
			toAddLink.email,
			this.mailService.generateLink(toAddLink.id, "auth/verify-reset-password"),
			token,
		);

		await this.prisma.resetPassword.create({
			data: { resetPasswordToken: token, userId: toAddLink.id, allowed: false },
		});
		return {
			message: `token has send to ${toAddLink.email.slice(0, 3)} ${"*".repeat(toAddLink.email.length - 3)}`,
		};
	}
	async sendLinkToSigned(email: EmailDto, id: number) {
		const token = randomBytes(32).toString("hex");
		await this.mailService.sendResetPsswordToken(
			email.email,
			this.mailService.generateLink(id, "verify-reset-password"),
			token,
		);
		await this.prisma.resetPassword.create({
			data: { resetPasswordToken: token, userId: id, allowed: false },
		});
		const [localPart, domain] = email.email.split("@");
		const maskedLocal = localPart.length > 3
			? `${localPart.slice(0, 3)}${"*".repeat(localPart.length - 3)}`
			: `${localPart[0]}${"*".repeat(localPart.length - 1)}`;

		return {
			message: `A reset token has been sent to ${maskedLocal}@${domain}`,
		};
	}

	async verifyToken(data: VerifyToken, userId: number) {
		const verify = await this.prisma.resetPassword.findFirst({
			where: { userId },
			orderBy: {
				id: "desc",
			},
		});
		if (!verify || !verify.resetPasswordToken)
			throw new NotFoundException("user doesn't have any verification token ");
		if (verify.resetPasswordToken !== data.resetPasswordToken) {
			throw new BadRequestException("this token is invalid");
		}
		await this.prisma.resetPassword.update({
			where: { id: verify.id },
			data: { allowed: true, resetPasswordToken: null },
		});
		return {
			message: `you are ready for reset your password in link ${this.mailService.generateLink(userId, "reset-password")}`,
		};
	}
	async resetPassword({ id, newPassword }: ResetPassword) {
		const user = await this.userService.findOneById(id);
		const resetPassword = await this.prisma.resetPassword.findFirst({
			where: { userId: id },
			orderBy: { id: "desc" }
		});
		if (!resetPassword)
			throw new ForbiddenException("you don't verify your password token");
		if (!user) throw new NotFoundException("no account with this id");
		if (resetPassword.allowed !== true) {
			throw new BadRequestException()
		}
		return await this.prisma.user.update({
			where: { id },
			data: { password: await hashPassword(newPassword) },
		});
	}
}
