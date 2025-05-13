import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Response } from 'express';

@Controller('file-upload')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // Загрузка файла
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.handleFileUpload(file);
  }

  // Получение файла
  @Get('files/:filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const fileStream = this.filesService.getFile(filename);
    return res.send(fileStream);
  }

  // Удаление файла
  @Delete('files/:filename')
  deleteFile(@Param('filename') filename: string) {
    return this.filesService.deleteFile(filename);
  }
}
