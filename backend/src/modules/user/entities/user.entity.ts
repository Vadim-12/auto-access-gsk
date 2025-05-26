import { UserRoleEnum } from '../../../consts';
import { RefreshTokenEntity } from '../../auth/entities/refresh-token.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { GarageEntity } from '../../garage/entities/garage.entity';
import { CarEntity } from '../../car/entities/car.entity';
import { GarageRequestEntity } from '../../garage-request/entities/garage-request.entity';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'User UUID',
    name: 'user_id',
  })
  readonly userId: string;

  @Column('enum', {
    comment: 'Role of user',
    nullable: false,
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role: UserRoleEnum;

  @Column('varchar', {
    comment: 'User password hash',
    nullable: false,
    length: 100,
    name: 'password_hash',
  })
  passwordHash: string;

  @Column('varchar', {
    comment: 'User first name',
    nullable: false,
    length: 50,
    name: 'first_name',
  })
  firstName: string;

  @Column('varchar', {
    comment: 'User last name',
    nullable: false,
    length: 50,
    name: 'last_name',
  })
  lastName: string;

  @Column('varchar', {
    comment: 'User phone number',
    nullable: false,
    length: 20,
    name: 'phone_number',
  })
  phoneNumber: string;

  @Column('varchar', {
    comment: 'User middle name',
    nullable: true,
    length: 50,
    name: 'middle_name',
  })
  middleName?: string;

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshTokenEntity[];

  @ManyToMany(() => GarageEntity, (garage) => garage.users)
  @JoinTable({
    name: 'user_garages',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'userId',
    },
    inverseJoinColumn: {
      name: 'garage_id',
      referencedColumnName: 'garageId',
    },
  })
  garages: GarageEntity[];

  @OneToMany(() => CarEntity, (car) => car.owner)
  cars: CarEntity[];

  @OneToMany(() => GarageRequestEntity, (request) => request.user)
  garageRequests: GarageRequestEntity[];
}
