import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'verification_session' })
export class VerificationSessionEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Phone verification ID',
    name: 'phone_verification_id',
  })
  readonly phoneVerificationId: string;

  @Column('varchar', {
    comment: 'Phone number',
    nullable: false,
    length: 20,
  })
  phoneNumber: string;

  @Column('varchar', {
    comment: 'Verification code',
    nullable: false,
    length: 6,
  })
  verificationCode: string;

  @Column('timestamp', {
    comment: 'Verification code expiration time',
    nullable: false,
  })
  expirationTime: Date;

  @Column('boolean', {
    comment: 'Is code verified',
    nullable: false,
    default: false,
  })
  isVerified: boolean;

  @Column('array', {
    comment: 'Attempts to input verification code',
    nullable: false,
    default: [],
  })
  attempts: Date[];
}
