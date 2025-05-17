import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User phone number',
    required: true,
    type: String,
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    description: 'User password hash',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  passwordHash: string;

  @ApiProperty({
    description: 'User first name',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'User middle name',
    required: true,
    type: String,
  })
  @IsString()
  @IsOptional()
  middleName?: string;
}
