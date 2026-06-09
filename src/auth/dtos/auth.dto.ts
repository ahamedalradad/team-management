import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsString,
	Length,
	IsNotEmpty,
	IsEmail,
	IsOptional,
} from "class-validator";

export class AuthSignInDto {
	@IsNotEmpty()
	@IsEmail()
	@ApiProperty({ description: "The email address of the user", example: "user@example.com" })
	email!: string;

	@IsNotEmpty()
	@IsString()
	@Length(8, undefined)
	@ApiProperty({ description: "The password of the user (Minimum 8 characters)", example: "StrongPass123!" })
	password!: string;
}

export class AuthSignUpDto {
	@IsNotEmpty()
	@IsEmail()
	@ApiProperty({ description: "The email address for registration", example: "newuser@example.com" })
	email!: string;

	@IsString()
	@IsNotEmpty()
	@Length(3)
	@ApiProperty({ description: "The full name of the user (Minimum 3 characters)", example: "John Doe" })
	name!: string;

	@IsNotEmpty()
	@IsString()
	@Length(8, undefined)
	@ApiProperty({ description: "The password for the new account (Minimum 8 characters)", example: "StrongPass123!" })
	password!: string;

	@IsString({ each: true })
	@IsOptional()
	// Fixed typo from 'skillls' to 'skills' for clean code
	@ApiPropertyOptional({ description: "List of user skills", isArray: true, example: ["Node.js", "React"] })
	skills?: string[];

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ description: "The profile description or bio of the user", example: "Full Stack Developer" })
	profile!: string;
}

// Renamed class to 'EmailDto' to follow standard naming conventions (PascalCase)
export class EmailDto {
	@IsNotEmpty()
	@IsEmail()
	@ApiProperty({ description: "The email address for verification or identification", example: "user@example.com" })
	email!: string;
}
