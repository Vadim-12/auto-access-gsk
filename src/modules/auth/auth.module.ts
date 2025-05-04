import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokensModule } from '../tokens/tokens.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TokensModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
