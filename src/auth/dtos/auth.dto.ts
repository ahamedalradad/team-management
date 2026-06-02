import {
  IsString,
  Length,
  IsNotEmpty,
  IsEmail,
  IsOptional,
} from "class-validator";
export class AuthSignInDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, undefined)
  password!: string;
}
export class AuthSignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  @IsString()
  @IsNotEmpty()
  @Length(3)
  name!: string;
  @IsNotEmpty()
  @IsString()
  @Length(8, undefined)
  password!: string;
  @IsString({ each: true })
  @IsOptional()
  skillls?: string[];
  @IsOptional()
  @IsString()
  profile!: string;
}
export class email {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
