import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { AuthHttpGuard } from '../auth/guards/auth-http.guard';

@Controller('cars')
@UseGuards(AuthHttpGuard)
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  create(@Request() req, @Body() createCarDto: CreateCarDto) {
    return this.carService.create(req.user.userId, createCarDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.carService.findByUserId(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.carService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
  ) {
    return this.carService.update(req.user.userId, id, updateCarDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.carService.delete(req.user.userId, id);
  }
}
