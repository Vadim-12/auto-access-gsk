import { IsString, IsIP, IsInt, IsPort } from 'class-validator';

export class UpdateGateSettingsDto {
  @IsString()
  @IsIP()
  ip: string;

  @IsInt()
  @IsPort()
  port: number;
}
