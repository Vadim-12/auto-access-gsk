import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GarageEntity } from '../../garage/entities/garage.entity';

@Entity({
  name: 'cameras',
})
export class CameraEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Camera UUID',
    name: 'camera_id',
  })
  readonly cameraId: string;

  @Column({
    length: 15,
    name: 'ip',
    comment: 'Camera IP address',
  })
  ip: string;

  @Column({
    name: 'stream_port',
    comment: 'Camera stream port',
    default: 81,
    nullable: true,
  })
  streamPort: number;

  @Column({
    name: 'snapshot_port',
    comment: 'Camera snapshot port',
    default: 80,
    nullable: true,
  })
  snapshotPort: number;

  @OneToOne(() => GarageEntity, (garage) => garage.camera)
  @JoinColumn({ name: 'garage_id' })
  garage: GarageEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
