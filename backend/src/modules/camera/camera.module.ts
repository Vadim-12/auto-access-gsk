import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CameraGateway } from './camera.gateway';
import { AuthModule } from '../auth/auth.module';
import { CameraEntity } from './entities/camera.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CameraEntity]), AuthModule],
  providers: [CameraGateway],
  exports: [CameraGateway],
})
export class CameraModule {}
