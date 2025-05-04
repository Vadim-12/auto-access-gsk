import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './sign-up.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
