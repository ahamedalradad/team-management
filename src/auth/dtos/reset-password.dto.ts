import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyToken {
  @IsNotEmpty()
  @IsInt()
  id!: number;

  @IsNotEmpty()
  @IsString()
  resetPasswordToken!: string;
}
export class ResetPassword {
  @IsNotEmpty()
  @IsInt()
  id!: number;
  @IsNotEmpty()
  @Length(8, undefined)
  @IsString()
  newPassword!: string;
}
