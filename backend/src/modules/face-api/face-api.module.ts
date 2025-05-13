import { Module } from '@nestjs/common';
import { FaceApiService } from './face-api.service';
@Module({
  controllers: [],
  providers: [FaceApiService],
})
export class FaceApiModule {}
