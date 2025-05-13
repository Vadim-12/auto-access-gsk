import { Controller, Get, Query } from '@nestjs/common';
import { FaceApiService } from './face-api.service';

@Controller('face-api')
export class FaceApiController {
  constructor(private readonly faceApiService: FaceApiService) {}

  @Get('detect')
  async detect(@Query('imagePath') imagePath: string) {
    const result = await this.faceApiService.detectFaces(imagePath);
    return result;
  }
}
