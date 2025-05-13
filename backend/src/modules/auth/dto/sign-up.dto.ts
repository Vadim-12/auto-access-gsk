import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn, Unique } from 'typeorm';

export class SignUpDto {
  @ApiProperty({
    description: 'User id',
    required: false,
    type: String,
  })
  @IsString()
  @PrimaryGeneratedColumn('uuid', { name: 'user_id', comment: 'User id' })
  userId: string;

  @ApiProperty({
    description: 'User phone number',
    required: true,
    type: String,
  })
  @IsString()
  @Unique(['phoneNumber'])
  phoneNumber: string;

  @ApiProperty({
    description: 'User email',
    required: false,
    type: String,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

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
}
