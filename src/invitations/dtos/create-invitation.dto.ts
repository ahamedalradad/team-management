import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateInvitationDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({description:"email of user"})
  email!: string;
}