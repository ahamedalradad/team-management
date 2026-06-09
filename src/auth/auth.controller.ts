import { ToAddLinkDto } from "./dtos/to-add-link.dto";
import { AuthService } from "./auth.service";
import {
	Body,
	Controller,
	Headers,
	Param,
	Post,
	ParseIntPipe,
	UseGuards,
} from "@nestjs/common";
import { AuthSignInDto, AuthSignUpDto } from "./dtos/auth.dto";
import { ResetPassword, VerifyToken } from "./dtos/reset-password.dto";
import { ApiHeader, ApiOperation, ApiParam, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { CurrentUser } from "src/decorators/current-user.decorator";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post("sign-in")
	@ApiOperation({ summary: "User Sign In", description: "Authenticate a user with email and password to receive a session token." })
	signIn(@Body() data: AuthSignInDto) {
		return this.authService.signIn(data);
	}

	@Post("sign-up")
	@ApiOperation({ summary: "User Sign Up", description: "Register a new user account in the system." })
	signUp(@Body() data: AuthSignUpDto) {
		return this.authService.createLink(data);
	}

	@Post("verify-email/:id")
	@ApiOperation({ summary: "Verify Email", description: "Verify a user's email using their user ID and the token sent via header." })
	@ApiParam({ name: "id", description: "The unique ID of the user", example: 1 })
	@ApiHeader({ name: "token", description: "The verification token received in email", required: true })
	verifyEmail(
		@Param("id", ParseIntPipe) id: number,
		@Headers("token") token: string,
	) {
		return this.authService.createAndVerify(id, Number(token));
	}

	@Post("reset-password-link")
	@ApiOperation({ summary: "Send Reset Password Link (Guest)", description: "Send a password reset link to a user who is not logged in." })
	sendLink(@Body() data: ToAddLinkDto) {
		return this.authService.sendLink(data);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: "Send Reset Password Link (Logged In)", description: "Send a password reset link to the currently authenticated user." })
	@Post("reset-password-link-signed")
	@UseGuards(JwtAuthGuard)
	sendLinkToSigned(@CurrentUser() user: any) {
		return this.authService.sendLinkToSigned(user.email, user.id);
	}

	@Post("verify-reset-password/:id")
	@ApiOperation({ summary: "Verify Reset Password Token", description: "Verify if the provided password reset token is valid for the user." })
	@ApiParam({ name: "id", description: "The unique ID of the user trying to reset password", example: 1 })
	async verifyToken(
		@Param("id", ParseIntPipe) id: number,
		@Body() data: VerifyToken,
	) {
		return await this.authService.verifyToken(data, id);
	}

	@Post("reset-password")
	@ApiOperation({ summary: "Reset Password", description: "Update the user's password using the verified user ID and new password data." })
	resetPassword(@Body() data: ResetPassword) {
		return this.authService.resetPassword(data);
	}
}
