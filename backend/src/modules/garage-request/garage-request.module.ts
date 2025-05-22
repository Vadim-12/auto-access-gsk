import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GarageRequestEntity } from './entities/garage-request.entity';
import { GarageRequestService } from './garage-request.service';
import { GarageRequestController } from './garage-request.controller';
import { GarageEntity } from '../garage/entities/garage.entity';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GarageRequestEntity, GarageEntity, UserEntity]),
  ],
  controllers: [GarageRequestController],
  providers: [GarageRequestService],
  exports: [GarageRequestService],
})
export class GarageRequestModule {}
