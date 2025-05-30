import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsIP,
  IsPort,
} from 'class-validator';

export class CreateGarageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  totalSpaces: number;

  @IsString()
  @IsIP()
  @IsNotEmpty()
  gateIp: string;

  @IsInt()
  @IsPort()
  @IsNotEmpty()
  gatePort: number;

  @IsString()
  @IsIP()
  @IsOptional()
  cameraIp?: string;

  @IsInt()
  @IsPort()
  @IsOptional()
  cameraStreamPort?: number;

  @IsInt()
  @IsPort()
  @IsOptional()
  cameraSnapshotPort?: number;
}
