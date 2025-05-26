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
  JoinColumn,
} from 'typeorm';
import { CameraEntity } from '../../camera/entities/camera.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { GarageRequestEntity } from '../../garage-request/entities/garage-request.entity';
import { GateEntity } from '../../gate/entities/gate.entity';

@Entity({
  name: 'garages',
})
export class GarageEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Garage UUID',
    name: 'garage_id',
  })
  readonly garageId: string;

  @Column({
    length: 10,
    comment: 'Garage number',
  })
  number: string;

  @Column({
    length: 255,
    nullable: true,
    comment: 'Garage description',
  })
  description?: string;

  @OneToOne(() => CameraEntity, (camera) => camera.garage)
  camera: CameraEntity;

  @OneToOne(() => GateEntity, (gate) => gate.garage)
  gate: GateEntity;

  @ManyToMany(() => UserEntity, (user) => user.garages)
  @JoinTable({
    name: 'user_garages',
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

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'admin_user_id' })
  admin: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
