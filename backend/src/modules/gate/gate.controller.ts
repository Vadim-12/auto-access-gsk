import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { GateService } from './gate.service';
import { CreateGateDto } from './dto/create-gate.dto';
import { UpdateGateDto } from './dto/update-gate.dto';
import { GateEntity } from './entities/gate.entity';

@Controller('gates')
export class GateController {
  constructor(private readonly gateService: GateService) {}

  @Post()
  async create(@Body() createGateDto: CreateGateDto): Promise<GateEntity> {
    return await this.gateService.create(createGateDto);
  }

  @Get(':gateId')
  async findOne(@Param('gateId') gateId: string): Promise<GateEntity> {
    return await this.gateService.findOne(gateId);
  }

  @Put(':gateId')
  async update(
    @Param('gateId') gateId: string,
    @Body() updateGateDto: UpdateGateDto,
  ): Promise<GateEntity> {
    return await this.gateService.update(gateId, updateGateDto);
  }

  @Delete(':gateId')
  async delete(@Param('gateId') gateId: string): Promise<void> {
    await this.gateService.delete(gateId);
  }
}
