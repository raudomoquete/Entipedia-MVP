import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

/**
 * Servicio de almacenamiento local de archivos.
 * Los archivos se guardan en la carpeta /uploads relativa al proyecto.
 */
export class LocalFileStorageService {
  private readonly uploadRoot: string;

  constructor() {
    this.uploadRoot = path.join(process.cwd(), 'uploads');
  }

  /**
   * Sube un archivo al filesystem local.
   * @returns Ruta relativa (p.ej. "2025/01/uuid-filename.ext")
   */
  async uploadFile(
    buffer: Buffer,
    filename: string,
    mimetype: string
  ): Promise<string> {
    const ext = path.extname(filename);
    const safeExt = ext || this.getExtensionFromMime(mimetype) || '';
    const uniqueName = `${randomUUID()}${safeExt}`;

    const year = new Date().getFullYear().toString();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const relativeDir = path.join(year, month);

    const dirPath = path.join(this.uploadRoot, relativeDir);
    await fs.mkdir(dirPath, { recursive: true });

    const relativePath = path.join(relativeDir, uniqueName);
    const fullPath = path.join(this.uploadRoot, relativePath);

    await fs.writeFile(fullPath, buffer);

    return relativePath.replace(/\\/g, '/');
  }

  /**
   * Elimina un archivo del filesystem local.
   */
  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.uploadRoot, filePath);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      // Si el archivo no existe, lo consideramos ya eliminado.
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Devuelve la URL pública para acceder al archivo.
   * Express ya sirve /uploads como estático.
   */
  getFileUrl(filePath: string): string {
    const normalized = filePath.replace(/\\/g, '/');
    return `/uploads/${normalized}`;
  }

  private getExtensionFromMime(mimetype: string): string | null {
    if (mimetype.startsWith('image/')) {
      const subtype = mimetype.split('/')[1];
      if (subtype === 'jpeg') return '.jpg';
      return `.${subtype}`;
    }
    if (mimetype === 'application/pdf') return '.pdf';
    return null;
  }
}


