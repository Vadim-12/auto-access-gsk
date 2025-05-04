import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'User ID (generated automatically)',
    required: false,
    type: String,
  })
  @Expose()
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'User phone number',
    required: true,
    type: String,
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'User first name',
    required: true,
    type: String,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    required: true,
    type: String,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'User middle name',
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({
    description: 'User email',
    required: false,
    type: String,
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
