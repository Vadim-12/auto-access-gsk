import { ApiProperty } from '@nestjs/swagger';

export class JwtDto {
  @ApiProperty({
    description: 'Access JWT',
    type: String,
    required: true,
  })
  access: string;

  @ApiProperty({
    description: 'Refresh JWT',
    type: String,
    required: true,
  })
  refresh: string;
}

export class RefreshJwtDto {
  @ApiProperty({
    description: 'Refresh JWT',
    type: String,
    required: true,
  })
  readonly refresh: string;
}
