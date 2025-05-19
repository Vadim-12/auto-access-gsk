import { Module } from '@nestjs/common';
import { CameraGateway } from './camera.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [CameraGateway],
  exports: [CameraGateway],
})
export class CameraModule {}
