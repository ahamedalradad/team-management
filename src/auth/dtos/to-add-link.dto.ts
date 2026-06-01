import { IsEmail, IsInt, IsNotEmpty } from 'class-validator';

export class ToAddLinkDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  @IsNotEmpty()
  @IsInt()
  id!: number;
}
