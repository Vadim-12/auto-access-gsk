import { IsString, IsIP, IsPort } from 'class-validator';

export class UpdateCameraSettingsDto {
  @IsString()
  @IsIP()
  ip: string;

  @IsPort()
  streamPort: number;

  @IsPort()
  snapshotPort: number;
}
