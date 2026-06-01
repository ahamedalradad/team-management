import { Exclude } from "class-transformer";
import { IsJSON, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
  @IsNotEmpty()
  @IsString()
  @Length(10, 300)
  description!: string;
  @IsNotEmpty()
  @IsString({ each: true })
  skillsRequired!: string[];
  @Exclude()
  teamId!: number;
  @Exclude()
  active!: boolean;
}
