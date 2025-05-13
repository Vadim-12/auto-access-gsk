import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'refresh_token' })
export class RefreshTokenEntity {
  @PrimaryColumn('varchar', {
    comment: 'Refresh token',
    nullable: false,
    length: 255,
  })
  refreshToken: string;

  @ManyToOne(() => UserEntity, (user) => user.refreshTokens)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
