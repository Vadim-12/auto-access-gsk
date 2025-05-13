import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutDto {
  @ApiProperty({
    description: 'Refresh token',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: 'Field "refreshToken" is required' })
  @IsString({ message: 'Field "refreshToken" must be a string' })
  readonly refreshToken: string;
}
