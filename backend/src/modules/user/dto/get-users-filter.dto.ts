import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetUserFilterDto {
  @ApiProperty({
    description: 'User UUIDs',
    type: [String],
    required: false,
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
  })
  @IsOptional()
  @IsString({
    each: true,
    message: 'Fields in array "userIds" must be strings',
  })
  readonly userIds?: string[];

  @ApiProperty({
    description: 'User phone numbers',
    type: [String],
    required: false,
    example: ['+79999999999', '+79999999998'],
  })
  @IsOptional()
  @IsString({
    each: true,
    message: 'Fields in array "phoneNumbers" must be strings',
  })
  readonly phoneNumbers?: string[];

  @ApiProperty({
    description: 'Number of users to take',
    type: Number,
    required: false,
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  readonly take?: number;

  @ApiProperty({
    description: 'Number of users to skip',
    type: Number,
    required: false,
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  readonly skip?: number;
}
