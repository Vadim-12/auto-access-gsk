import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GarageEntity } from './entities/garage.entity';
import { GarageService } from './garage.service';
import { GarageController } from './garage.controller';
import { GarageRequestModule } from '../garage-request/garage-request.module';
import { UserEntity } from '../user/entities/user.entity';
import { CameraEntity } from '../camera/entities/camera.entity';
import { GateModule } from '../gate/gate.module';
import { GateEntity } from '../gate/entities/gate.entity';
import { GarageAccessLogEntity } from './entities/garage-access-log.entity';
import { CarEntity } from '../car/entities/car.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GarageEntity,
      UserEntity,
      CameraEntity,
      GateEntity,
      GarageAccessLogEntity,
      CarEntity,
    ]),
    GarageRequestModule,
    GateModule,
  ],
  controllers: [GarageController],
  providers: [GarageService],
  exports: [GarageService],
})
export class GarageModule {}
