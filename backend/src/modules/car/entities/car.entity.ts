import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({
  name: 'car',
})
export class CarEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Car UUID',
    name: 'car_id',
  })
  readonly carId: string;

  @Column('varchar', {
    comment: 'Car brand',
    nullable: false,
    length: 50,
  })
  brand: string;

  @Column('varchar', {
    comment: 'Car model',
    nullable: false,
    length: 50,
  })
  model: string;

  @Column('int', {
    comment: 'Car year',
    nullable: false,
  })
  year: number;

  @Column('varchar', {
    comment: 'Car license plate',
    nullable: false,
    length: 20,
    unique: true,
  })
  licensePlate: string;

  @Column('varchar', {
    comment: 'Car color',
    nullable: false,
    length: 30,
  })
  color: string;

  @ManyToOne(() => UserEntity, (user) => user.cars)
  @JoinColumn({ name: 'user_id' })
  owner: UserEntity;
}
