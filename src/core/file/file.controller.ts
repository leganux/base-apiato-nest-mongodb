import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { multerOptions } from '../config/multer.config';
import { ApiTags } from "@nestjs/swagger";

@ApiTags('File')
@Controller('api/v1/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.saveFile(file);
  }

  @Post('upload/many')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.fileService.saveFiles(files);
  }
}
