import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File } from './schemas/file.schema';
import * as fs from 'fs';
import * as path from 'path';
import * as multer from 'multer';

@Injectable()
export class FileService {
  constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

  async saveFile(file: Express.Multer.File): Promise<File> {
    // Crear directorio basado en año/mes/día
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const uploadDir = path.join(
      __dirname,
      `../../public/${year}/${month}/${day}`,
    );

    // Crear el directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generar nombre único para el archivo
    const filename = `${file.originalname.split('.')[0]}-${Date.now()}${path.extname(file.originalname)}`;
    const localPath = path.join(uploadDir, filename);
    const publicPath = `/public/${year}/${month}/${day}/${filename}`;

    // Guardar el archivo en el sistema
    fs.writeFileSync(localPath, file.buffer);

    // Guardar la información del archivo en MongoDB
    const newFile = new this.fileModel({
      localPath,
      publicPath,
      filename,
    });

    return newFile.save();
  }

  // Servicio para manejar varios archivos
  async saveFiles(files: Express.Multer.File[]): Promise<File[]> {
    const savedFiles = [];
    for (const file of files) {
      const savedFile = await this.saveFile(file);
      savedFiles.push(savedFile);
    }
    return savedFiles;
  }
}
