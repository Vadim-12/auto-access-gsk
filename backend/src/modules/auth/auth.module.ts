import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokensModule } from '../tokens/tokens.module';
import { UserModule } from '../user/user.module';
import { TwilioModule } from '../twilio/twilio.module';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';

@Module({
  imports: [
    TokensModule,
    UserModule,
    TwilioModule,
    DatabaseModule,
    TypeOrmModule.forFeature([RefreshTokenEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
