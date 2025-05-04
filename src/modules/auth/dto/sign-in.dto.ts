import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'User phone number',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: 'Field "phoneNumber" is required' })
  @IsString({ message: 'Field "phoneNumber" must be a string' })
  readonly phoneNumber: string;
}
