import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { CameraStatusEnum } from '../../../consts';
import { GarageEntity } from '../../garage/entities/garage.entity';

@Entity({
  name: 'camera',
})
export class CameraEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Camera UUID',
    name: 'camera_id',
  })
  readonly cameraId: string;

  @Column('varchar', {
    comment: 'Camera IP address',
    nullable: false,
    length: 15,
  })
  ip: string;

  @Column('int', {
    comment: 'Camera port',
    nullable: false,
  })
  port: number;

  @OneToOne(() => GarageEntity, (garage) => garage.camera)
  @JoinColumn({ name: 'garage_id' })
  garage: GarageEntity;

  @Column('enum', {
    comment: 'Camera status',
    nullable: false,
    enum: CameraStatusEnum,
    default: CameraStatusEnum.INACTIVE,
  })
  status: CameraStatusEnum;

  @Column('varchar', {
    comment: 'Camera name',
    nullable: false,
    length: 100,
  })
  name: string;

  @Column('varchar', {
    comment: 'Camera description',
    nullable: true,
    length: 255,
  })
  description?: string;
}
