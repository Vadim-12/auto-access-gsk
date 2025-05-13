import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User phone number',
    required: true,
    type: String,
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    description: 'User email',
    required: true,
    type: String,
  })
  @IsEmail()
  email: string;

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
    required: true,
    type: String,
  })
  @IsString()
  @IsOptional()
  middleName?: string;
}
