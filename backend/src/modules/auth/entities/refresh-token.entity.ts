import {
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({
  name: 'refresh_tokens',
})
export class RefreshTokenEntity {
  @PrimaryColumn('varchar', {
    comment: 'Refresh token',
    length: 255,
    name: 'refresh_token',
  })
  refreshToken: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
