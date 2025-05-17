import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Папка для сохранения файлов
    }),
    AuthModule,
  ],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
