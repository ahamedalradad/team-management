import { PartialType } from '@nestjs/mapped-types';
import { AuthSignUpDto } from '../../auth/dtos/auth.dto';

export class UpdateUser extends PartialType(AuthSignUpDto) {}