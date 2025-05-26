import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CameraEntity } from './entities/camera.entity';
import { CameraService } from './camera.service';
import { CameraGateway } from './camera.gateway';
import { AiModule } from '../ai/ai.module';
import { GarageEntity } from '../garage/entities/garage.entity';
import { CarEntity } from '../car/entities/car.entity';
import { GarageModule } from '../garage/garage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CameraEntity, GarageEntity, CarEntity]),
    AiModule,
    GarageModule,
  ],
  providers: [CameraService, CameraGateway],
  exports: [CameraService],
})
export class CameraModule {}
