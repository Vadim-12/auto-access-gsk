import { ApiProperty } from '@nestjs/swagger';
import { IsIP, IsNotEmpty, IsPort } from 'class-validator';

export class CreateGateDto {
  @ApiProperty({
    description: 'IP адрес ворот',
    example: '192.168.1.1',
  })
  @IsIP()
  @IsNotEmpty()
  ip: string;

  @ApiProperty({
    description: 'Порт ворот',
    example: 8080,
  })
  @IsPort()
  @IsNotEmpty()
  port: number;
}
