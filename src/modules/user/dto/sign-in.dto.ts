import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'User phone number',
    required: true,
    type: String,
  })
  @Expose()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'User verification code',
    required: true,
    type: String,
  })
  @Expose()
  @IsString()
  verificationCode: string;
}
