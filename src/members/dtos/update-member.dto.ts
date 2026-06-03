import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export class UpdateMemberDto {
    @IsEnum(['user', 'admin'])
    @ApiProperty({description: "the role of user"})
    role!: string;
}