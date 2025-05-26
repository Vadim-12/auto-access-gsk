import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { GarageEntity } from '../../garage/entities/garage.entity';

export enum GarageRequestStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum GarageRequestTypeEnum {
  ACCESS = 'ACCESS',
  UNLINK = 'UNLINK',
}

@Entity({
  name: 'garage_requests',
})
export class GarageRequestEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Garage request UUID',
    name: 'request_id',
  })
  readonly requestId: string;

  @ManyToOne(() => UserEntity, (user) => user.garageRequests)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => GarageEntity, (garage) => garage.requests)
  @JoinColumn({ name: 'garage_id' })
  garage: GarageEntity;

  @Column('enum', {
    comment: 'Request status',
    nullable: false,
    enum: GarageRequestStatusEnum,
    default: GarageRequestStatusEnum.PENDING,
  })
  status: GarageRequestStatusEnum;

  @Column('varchar', {
    comment: 'Request description',
    nullable: true,
    length: 255,
    name: 'description',
  })
  description?: string;

  @Column({
    type: 'enum',
    enum: GarageRequestTypeEnum,
    default: GarageRequestTypeEnum.ACCESS,
  })
  type: GarageRequestTypeEnum;

  @Column('varchar', {
    comment: 'Admin comment for unlinking',
    nullable: true,
    length: 255,
    name: 'admin_comment',
  })
  adminComment?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
