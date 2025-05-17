import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  private uploadDirectory = path.resolve(__dirname, '..', '..', 'uploads');

  handleFileUpload(file: Express.Multer.File) {
    console.log('Uploaded file:', file);
    return {
      filename: file.filename,
      path: file.path,
    };
  }

  getFile(filename: string) {
    const filePath = path.join(this.uploadDirectory, filename);

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    return fs.createReadStream(filePath);
  }

  deleteFile(filename: string) {
    const filePath = path.join(this.uploadDirectory, filename);

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }

    fs.unlinkSync(filePath);
    return { message: 'File deleted successfully' };
  }
}
