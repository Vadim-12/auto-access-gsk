import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GateEntity } from './entities/gate.entity';
import { GateService } from './gate.service';
import { GateController } from './gate.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GateEntity])],
  controllers: [GateController],
  providers: [GateService],
  exports: [GateService],
})
export class GateModule {}
