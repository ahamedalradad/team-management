import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateTaskDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: "The name of the task", example: "Design Database Schema" })
	name!: string;

	@IsNotEmpty()
	@IsString()
	@Length(10, 300)
	@ApiProperty({ description: "Detailed description of the task (10 to 300 characters)", example: "Create tables, relations, and indexing for the new module." })
	description!: string;

	@IsNotEmpty()
	@IsString({ each: true })
	@ApiProperty({ description: "List of skills required to complete the task", isArray: true, example: ["NestJS", "TypeScript", "PostgreSQL"] })
	skillsRequired!: string[];

	@Exclude() // Excluded from direct user input via request body
	teamId!: number;

	@Exclude() // Excluded from direct user input
	active!: boolean;
}
