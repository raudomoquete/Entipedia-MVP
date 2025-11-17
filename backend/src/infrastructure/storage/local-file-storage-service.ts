import fs from 'fs';
import path from 'path';
import { env } from '../../shared/constants/env';

/**
 * Metadata básica de un archivo almacenado localmente
 */
export interface StoredFile {
  /** Nombre original del archivo */
  originalName: string;
  /** Nombre del archivo en disco (único) */
  storedName: string;
  /** Ruta relativa dentro de la carpeta uploads (ej: '123456-report.pdf') */
  relativePath: string;
  /** Tipo MIME */
  mimeType: string;
  /** Tamaño en bytes */
  size: number;
  /** Fecha de creación */
  createdAt: Date;
}

/**
 * Servicio de almacenamiento local de archivos en filesystem
 * Guarda los archivos en la carpeta `uploads/` en la raíz del backend.
 */
export class LocalFileStorageService {
  private readonly uploadsDir: string;

  constructor() {
    // La app se ejecuta desde la raíz del backend, por lo que `process.cwd()` apunta ahí.
    this.uploadsDir = path.join(process.cwd(), 'uploads');
  }

  /**
   * Guarda un archivo en disco y retorna su metadata completa.
   */
  async saveFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<StoredFile> {
    await this.ensureUploadsDir();

    const timestamp = Date.now();
    const sanitizedName = this.sanitizeFileName(originalName);
    const storedName = `${timestamp}-${sanitizedName}`;
    const fullPath = path.join(this.uploadsDir, storedName);

    await fs.promises.writeFile(fullPath, buffer);

    return {
      originalName,
      storedName,
      relativePath: storedName,
      mimeType,
      size: buffer.length,
      createdAt: new Date(),
    };
  }

  /**
   * Sube un archivo y devuelve solo la ruta relativa (helper para el dominio).
   */
  async uploadFile(
    buffer: Buffer,
    filename: string,
    mimetype: string
  ): Promise<string> {
    const stored = await this.saveFile(buffer, filename, mimetype);
    return stored.relativePath;
  }

  /**
   * Elimina un archivo del filesystem
   */
  async deleteFile(relativePath: string): Promise<void> {
    const fullPath = path.join(this.uploadsDir, relativePath);

    try {
      await fs.promises.unlink(fullPath);
    } catch (error) {
      // Si el archivo no existe, no lanzamos error para no romper el flujo
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Retorna la ruta pública para acceder al archivo desde el frontend
   * Retorna una URL absoluta para que funcione desde cualquier origen
   * Ejemplo: http://localhost:3000/uploads/123456-report.pdf
   */
  getPublicUrl(relativePath: string): string {
    const baseUrl = env.API_BASE_URL.endsWith('/') 
      ? env.API_BASE_URL.slice(0, -1) 
      : env.API_BASE_URL;
    return `${baseUrl}/uploads/${relativePath}`;
  }

  /**
   * Alias compatible con la firma solicitada en la capa de aplicación.
   */
  getFileUrl(filePath: string): string {
    return this.getPublicUrl(filePath);
  }

  /**
   * Asegura que la carpeta uploads exista
   */
  private async ensureUploadsDir(): Promise<void> {
    await fs.promises.mkdir(this.uploadsDir, { recursive: true });
  }

  /**
   * Limpia el nombre del archivo para evitar caracteres problemáticos
   */
  private sanitizeFileName(fileName: string): string {
    return fileName
      .normalize('NFKD')
      .replace(/[^\w.\-]+/g, '-')
      .toLowerCase();
  }
}


