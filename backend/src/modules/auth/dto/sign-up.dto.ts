import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
  @IsNotEmpty()
  @Unique(['phoneNumber'])
  phoneNumber: string;

  @ApiProperty({
    description: 'User password',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

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
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  middleName?: string;
}
