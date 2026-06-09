import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyToken {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: "The verification token sent for password resetting", example: "abc123xyz_token_secret" })
	resetPasswordToken!: string;
}

export class ResetPassword {
	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ description: "The unique user ID", example: 1 })
	id!: number;

	@IsNotEmpty()
	@Length(8, undefined)
	@IsString()
	@ApiProperty({ description: "The new password (must be at least 8 characters long)", example: "StrongPass123!" })
	newPassword!: string;
}
