import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  private uploadDirectory = path.resolve(__dirname, '..', '..', 'uploads');

  // Метод для обработки загрузки файлов
  handleFileUpload(file: Express.Multer.File) {
    console.log('Uploaded file:', file);
    return {
      filename: file.filename,
      path: file.path,
    };
  }

  // Метод для получения файла по имени
  getFile(filename: string) {
    const filePath = path.join(this.uploadDirectory, filename);

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    return fs.createReadStream(filePath);
  }

  // Метод для удаления файла
  deleteFile(filename: string) {
    const filePath = path.join(this.uploadDirectory, filename);

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    fs.unlinkSync(filePath); // Удаление файла
    return { message: 'File deleted successfully' };
  }
}
