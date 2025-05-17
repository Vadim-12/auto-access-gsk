import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthHttpGuard } from './guards/auth-http.guard';
import { AuthWsGuard } from './guards/auth-ws.guard';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TokensModule],
  providers: [AuthService, AuthHttpGuard, AuthWsGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthHttpGuard, AuthWsGuard],
})
export class AuthModule {}
