import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { GarageEntity } from './garage.entity';
import { CarEntity } from '../../car/entities/car.entity';

@Entity({
  name: 'garage_access_logs',
})
export class GarageAccessLogEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Log entry UUID',
    name: 'log_id',
  })
  readonly logId: string;

  @ManyToOne(() => GarageEntity)
  @JoinColumn({ name: 'garage_id' })
  garage: GarageEntity;

  @ManyToOne(() => CarEntity, { nullable: true })
  @JoinColumn({ name: 'detected_car_id' })
  detectedCar: CarEntity | null;

  @Column({
    type: 'text',
    comment: 'AI analysis description',
    name: 'ai_description',
  })
  aiDescription: string;

  @Column({
    type: 'float',
    comment: 'AI confidence level',
  })
  confidence: number;

  @Column({
    type: 'boolean',
    comment: 'Флаг разрешения доступа',
    name: 'is_access_granted',
    default: false,
  })
  isAccessGranted: boolean;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Detected car details',
    name: 'detected_car_details',
  })
  detectedCarDetails: {
    brand: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  } | null;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'detected_car_number',
    comment: 'Номер обнаруженного автомобиля',
  })
  detectedCarNumber: string;

  @Column({
    type: 'varchar',
    nullable: true,
    name: 'detected_car_color',
    comment: 'Цвет обнаруженного автомобиля',
  })
  detectedCarColor: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
