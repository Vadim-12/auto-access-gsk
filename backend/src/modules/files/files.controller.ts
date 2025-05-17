import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Response } from 'express';
import { AuthHttpGuard } from '../auth/guards/auth-http.guard';

@Controller('file-upload')
@UseGuards(AuthHttpGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.handleFileUpload(file);
  }

  @Get('files/:filename')
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const fileStream = this.filesService.getFile(filename);
    return res.send(fileStream);
  }

  @Delete('files/:filename')
  deleteFile(@Param('filename') filename: string) {
    return this.filesService.deleteFile(filename);
  }
}
