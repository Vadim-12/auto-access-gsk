import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({
    description: 'Марка автомобиля',
    example: 'Toyota',
  })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({
    description: 'Модель автомобиля',
    example: 'Camry',
  })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    description: 'Год выпуска',
    example: 2020,
  })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    description: 'Гос. номер',
    example: 'А123БВ777',
  })
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({
    description: 'Цвет автомобиля',
    example: 'Черный',
  })
  @IsString()
  @IsNotEmpty()
  color: string;
}
