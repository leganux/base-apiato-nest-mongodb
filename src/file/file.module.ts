import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';

import { File, FileSchema } from './schemas/file.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
