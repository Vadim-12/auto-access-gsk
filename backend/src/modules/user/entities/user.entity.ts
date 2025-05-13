import { UserRoleEnum } from 'src/consts';
import { RefreshTokenEntity } from 'src/modules/auth/entities/refresh-token.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'user',
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
    comment: 'User phone number',
    nullable: false,
    length: 20,
    unique: true,
  })
  phoneNumber: string;

  @Column('varchar', {
    comment: 'User email',
    length: 254,
    unique: true,
    nullable: true,
  })
  email?: string;

  @Column('varchar', {
    comment: 'User first name',
    nullable: false,
    length: 50,
  })
  firstName: string;

  @Column('varchar', {
    comment: 'User last name',
    nullable: false,
    length: 50,
  })
  lastName: string;

  @Column('varchar', {
    comment: 'User middle name',
    nullable: true,
    length: 50,
  })
  middleName?: string;

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshTokenEntity[];
}
