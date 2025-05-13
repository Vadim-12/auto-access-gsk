import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { UserEntity } from '../entities/user.entity';
import { UserRoleEnum } from 'src/consts';

export class UserDto {
  @ApiProperty({
    description: 'User UUID',
    required: true,
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Phone number of user',
    required: true,
    type: String,
    example: '+79999999999',
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    description: 'Email of user',
    required: false,
    type: String,
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'First name of user',
    required: true,
    type: String,
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of user',
    required: true,
    type: String,
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Middle name of user',
    required: false,
    type: String,
    example: 'Smith',
  })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({
    description: 'Role of user',
    required: true,
    type: String,
    example: UserRoleEnum.ADMIN,
  })
  @IsString()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  constructor(entity: Partial<UserEntity>) {
    return plainToInstance(UserDto, entity, { excludeExtraneousValues: true });
  }
}
