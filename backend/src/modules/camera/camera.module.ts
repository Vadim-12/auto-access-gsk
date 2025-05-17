import { Module } from '@nestjs/common';
import { CameraService } from './camera.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [CameraService],
  exports: [CameraService],
})
export class CameraModule {}
