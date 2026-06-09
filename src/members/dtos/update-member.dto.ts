import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class UpdateMemberDto {
	@IsEnum(['user', 'admin'])
	@ApiProperty({
		description: "The role of the member within the team",
		enum: ['user', 'admin'],
		example: 'user'
	})
	role!: string;
}
