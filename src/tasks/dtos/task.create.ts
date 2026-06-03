import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "name of task" })
  name!: string;
  @IsNotEmpty()
  @IsString()
  @Length(10, 300)
  @ApiProperty({ description: "description of task" })
  description!: string;
  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({ description: "skills required to task" })
  skillsRequired!: string[];
  @Exclude()
  teamId!: number;
  @Exclude()
  active!: boolean;
}
