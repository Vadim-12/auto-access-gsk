import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GateEntity } from './entities/gate.entity';
import { CreateGateDto } from './dto/create-gate.dto';
import { UpdateGateDto } from './dto/update-gate.dto';

@Injectable()
export class GateService {
  constructor(
    @InjectRepository(GateEntity)
    private readonly gateRepository: Repository<GateEntity>,
  ) {}

  async create(createGateDto: CreateGateDto): Promise<GateEntity> {
    const gate = this.gateRepository.create(createGateDto);
    return await this.gateRepository.save(gate);
  }

  async findOne(gateId: string): Promise<GateEntity> {
    return await this.gateRepository.findOne({ where: { gateId } });
  }

  async update(
    gateId: string,
    updateGateDto: UpdateGateDto,
  ): Promise<GateEntity> {
    await this.gateRepository.update(gateId, updateGateDto);
    return await this.findOne(gateId);
  }

  async delete(gateId: string): Promise<void> {
    await this.gateRepository.delete(gateId);
  }
}
