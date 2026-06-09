import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateInvitationDto {
	@IsNotEmpty()
	@IsEmail()
	@ApiProperty({ description: "The email address of the user to be invited", example: "user@example.com" })
	email!: string;
}
