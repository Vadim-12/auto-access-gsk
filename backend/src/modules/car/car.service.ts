import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarEntity } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(CarEntity)
    private readonly carRepository: Repository<CarEntity>,
  ) {}

  async findByUserId(userId: string): Promise<CarEntity[]> {
    const cars = await this.carRepository.find({
      where: { owner: { userId } },
      relations: ['owner'],
    });
    return cars;
  }

  async findOne(userId: string, id: string): Promise<CarEntity> {
    const car = await this.carRepository.findOne({
      where: { carId: id },
      relations: ['owner'],
    });

    if (!car || car.owner.userId !== userId) {
      throw new NotFoundException('Автомобиль не найден');
    }

    return car;
  }

  async create(userId: string, createCarDto: CreateCarDto): Promise<CarEntity> {
    const car = this.carRepository.create({
      ...createCarDto,
      owner: { userId },
    });
    return this.carRepository.save(car);
  }

  async update(
    userId: string,
    id: string,
    updateCarDto: UpdateCarDto,
  ): Promise<CarEntity> {
    const car = await this.findOne(userId, id);

    if (car.owner.userId !== userId) {
      throw new ForbiddenException('Вы можете изменять только свои автомобили');
    }

    Object.assign(car, updateCarDto);
    return this.carRepository.save(car);
  }

  async delete(userId: string, carId: string): Promise<void> {
    const car = await this.findOne(userId, carId);

    if (car.owner.userId !== userId) {
      throw new ForbiddenException('Вы можете удалять только свои автомобили');
    }

    await this.carRepository.remove(car);
  }
}
