import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GarageEntity } from './entities/garage.entity';
import { GarageService } from './garage.service';
import { GarageController } from './garage.controller';
import { GarageRequestModule } from '../garage-request/garage-request.module';
import { UserEntity } from '../user/entities/user.entity';
import { CameraEntity } from '../camera/entities/camera.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GarageEntity, UserEntity, CameraEntity]),
    GarageRequestModule,
  ],
  controllers: [GarageController],
  providers: [GarageService],
  exports: [GarageService],
})
export class GarageModule {}
