import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({description: "name of team"})
  name!: string;
  @IsOptional()
  @IsString()
  @ApiProperty({description: "team profile"})
  profile?: string;
  @IsOptional()
  @IsString()
  @ApiProperty({description: "is the team public"})
  public!: boolean;
}
