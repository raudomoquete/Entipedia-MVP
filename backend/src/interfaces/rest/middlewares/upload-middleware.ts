import multer from 'multer';
import path from 'path';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

// Usamos almacenamiento en memoria; la escritura en disco la hace LocalFileStorageService
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (_req, file, cb) => {
    // Aquí podríamos filtrar tipos MIME si hiciera falta.
    if (!file.originalname) {
      return cb(new Error('Invalid file name'));
    }

    const ext = path.extname(file.originalname || '').toLowerCase();
    if (!ext) {
      // Permitimos archivos sin extensión, pero podrías bloquearlos si quieres
      cb(null, true);
      return;
    }

    cb(null, true);
  },
});



