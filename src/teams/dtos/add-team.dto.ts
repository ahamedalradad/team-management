import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTeamDto {
	@IsNotEmpty()
	@IsString()
	@ApiProperty({ description: "The name of the team", example: "Backend Developers" })
	name!: string;

	@IsOptional()
	@IsString()
	@ApiPropertyOptional({ description: "The profile description or image URL of the team", example: "https://example.com/profiles/team1.png" })
	profile?: string;

	@IsOptional()
	@ApiPropertyOptional({ description: "Indicates if the team is publicly visible", default: true, example: true })
	public!: boolean;
}
