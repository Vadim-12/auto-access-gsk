import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthHttpGuard } from './guards/auth-http.guard';
import { AuthWsGuard } from './guards/auth-ws.guard';
import { TokensModule } from '../tokens/tokens.module';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    TokensModule,
    UserModule,
  ],
  providers: [AuthService, AuthHttpGuard, AuthWsGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthHttpGuard, AuthWsGuard],
})
export class AuthModule {}
