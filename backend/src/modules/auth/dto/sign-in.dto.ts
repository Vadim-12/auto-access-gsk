import { IsPhoneNumber, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;
}
