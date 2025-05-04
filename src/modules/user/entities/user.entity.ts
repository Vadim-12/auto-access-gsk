import { IsPhoneNumber } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'User ID',
    name: 'user_id',
  })
  readonly userId: string;

  @Column('varchar', {
    comment: 'User phone number',
    nullable: false,
    length: 20,
    unique: true,
  })
  @IsPhoneNumber(undefined, {
    message: 'Phone number must be in format like +79999999999',
  })
  phoneNumber: string;

  @Column('varchar', {
    comment: 'User email',
    length: 254,
    unique: true,
  })
  email?: string;

  @Column('char', {
    comment: 'Verification code',
    nullable: false,
    length: 6,
  })
  verificationCode: string;

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
    nullable: false,
    length: 50,
  })
  middleName: string;
}
