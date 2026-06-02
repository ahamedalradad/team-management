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
  UseGuards,
} from "@nestjs/common";
import { AuthSignInDto, AuthSignUpDto } from "./dtos/auth.dto";
import { ResetPassword, VerifyToken } from "./dtos/reset-password.dto";
import { ApiHeader } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CurrentUser } from "src/guards/decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  signIn(@Body() data: AuthSignInDto) {
    return this.authService.signIn(data);
  }

  @Post("sign-up")
  signUp(@Body() data: AuthSignUpDto) {
    return this.authService.createLink(data);
  }

  @Post("verify-email/:id")
  verifyEmail(
    @Param("id", ParseIntPipe) id: number,
    @Headers("token") token: string,
  ) {
    return this.authService.createAndVerify(id, Number(token));
  }

  @Post("reset-password-link")
  sendLink(@Body() data: ToAddLinkDto) {
    return this.authService.sendLink(data);
  }

  @ApiHeader({
  name: 'authorization',
  required: true, // <-- This tells Swagger it is optional
  description: 'Bearer token for authorization',
})
  @Post("reset-password-link-signed")
  @UseGuards(JwtAuthGuard)
  sendLinkToSigned(@CurrentUser() user: any) {
    return this.authService.sendLinkToSigned(user.email, user.id);
  }

  @Post("verify-reset-password/:id")
  async verifyToken(
    @Param("id", ParseIntPipe) id: number,
    @Body() data: VerifyToken,
  ) {
    return await this.authService.verifyToken(data, id);
  }

  @Post("reset-password")
  resetPassword(@Body() data: ResetPassword) {
    return this.authService.resetPassword(data);
  }
}
