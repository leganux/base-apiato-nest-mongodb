import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

export const multerOptions = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');

      const uploadDir = path.join(
        __dirname,
        `../../public/${year}/${month}/${day}`,
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const filename = `${file.originalname.split('.')[0]}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
      return cb(new Error('Solo se permiten imágenes o PDFs'), false);
    }
    cb(null, true);
  },
};
