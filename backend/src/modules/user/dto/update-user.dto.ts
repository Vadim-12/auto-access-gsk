import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User phone number',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({
    description: 'User first name',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'User middle name',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  middleName?: string;
}
