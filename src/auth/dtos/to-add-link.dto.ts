import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty } from 'class-validator';

export class ToAddLinkDto {
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty({ description: "The target email address for the link", example: "member@company.com" })
	email!: string;

	@IsNotEmpty()
	@IsInt()
	@ApiProperty({ description: "The unique ID of the entity or team", example: 15 })
	id!: number;
}
