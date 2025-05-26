import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { GarageEntity } from '../../garage/entities/garage.entity';

export enum GateStatusEnum {
  OPENED = 'opened',
  CLOSED = 'closed',
}

@Entity('gates')
@Index('IDX_gates_ip_port', ['ip', 'port'], { unique: true })
export class GateEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'gate_id' })
  gateId: string;

  @Column({ length: 15, comment: 'Gate IP address' })
  ip: string;

  @Column({ comment: 'Gate port' })
  port: number;

  @Column({
    type: 'enum',
    enum: GateStatusEnum,
    default: GateStatusEnum.CLOSED,
  })
  status: GateStatusEnum;

  @ManyToOne(() => GarageEntity, (garage) => garage.gate, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'garage_id' })
  garage: GarageEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
