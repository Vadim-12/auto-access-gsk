import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CameraEntity } from '../../camera/entities/camera.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { GarageRequestEntity } from '../../garage-request/entities/garage-request.entity';

@Entity({
  name: 'garage',
})
export class GarageEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Garage UUID',
    name: 'garage_id',
  })
  readonly garageId: string;

  @Column('varchar', {
    comment: 'Garage number',
    nullable: false,
    length: 10,
  })
  number: string;

  @Column('varchar', {
    comment: 'Garage description',
    nullable: true,
    length: 255,
  })
  description?: string;

  @Column('varchar', {
    comment: 'Gate IP address',
    nullable: false,
    length: 15,
  })
  gateIp: string;

  @Column('int', {
    comment: 'Gate port',
    nullable: false,
  })
  gatePort: number;

  @OneToOne(() => CameraEntity, (camera) => camera.garage)
  camera: CameraEntity;

  @ManyToMany(() => UserEntity, (user) => user.garages)
  @JoinTable({
    name: 'user_garage',
    joinColumn: {
      name: 'garage_id',
      referencedColumnName: 'garageId',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'userId',
    },
  })
  users: UserEntity[];

  @OneToMany(() => GarageRequestEntity, (request) => request.garage)
  requests: GarageRequestEntity[];

  @ManyToOne(() => UserEntity, { eager: true })
  admin: UserEntity;

  @OneToMany(() => GarageRequestEntity, (request) => request.garage)
  accessRequests: GarageRequestEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
