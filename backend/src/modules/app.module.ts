import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { CameraModule } from './camera/camera.module';
import { DatabaseModule } from './database/database.module';
import { GarageModule } from './garage/garage.module';
import { CarModule } from './car/car.module';
import { GarageRequestModule } from './garage-request/garage-request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    JwtModule.register({
      global: true,
    }),
    UserModule,
    AuthModule,
    FilesModule,
    CameraModule,
    GarageModule,
    CarModule,
    GarageRequestModule,
  ],
})
export class AppModule {}
