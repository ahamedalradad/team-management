import { IsEnum } from "class-validator";

export class UpdateMemberDto {
    @IsEnum(['user', 'admin'])
    role!: string;
}