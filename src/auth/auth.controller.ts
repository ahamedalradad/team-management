import { ToAddLinkDto } from "./dtos/to-add-link.dto";
import { AuthService } from "./auth.service";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  ParseIntPipe,
} from "@nestjs/common";
import { AuthSignInDto, AuthSignUpDto } from "./dtos/auth.dto";
import { ResetPassword, VerifyToken } from "./dtos/reset-password.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  async signIn(@Body() data: AuthSignInDto) {
    return await this.authService.signIn(data);
  }

  @Post("sign-up")
  async signUp(@Body() data: AuthSignUpDto) {
    return await this.authService.createLink(data);
  }

  @Post("verify-email/:id")
  async verifyEmail(
    @Param("id", ParseIntPipe) id: number,
    @Headers("token") token: string,
  ) {
    return await this.authService.createAndVerify(id, Number(token));
  }

  @Post("reset-password-link")
  async sendLink(
    @Body() data: ToAddLinkDto,
    @Headers("authorization") token: string,
  ) {
    return await this.authService.sendLink(data, token);
  }

  @Post("verify-reset-password/:id")
  async verifyToken(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: VerifyToken,
  ) {
    if (id !== data.id) {
      throw new BadRequestException("user identifiers are not similar");
    }
    return await this.authService.verifyToken(data);
  }

  @Post("reset-password")
  async resetPassword(@Body() data: ResetPassword) {
    return await this.authService.resetPassword(data);
  }
}
