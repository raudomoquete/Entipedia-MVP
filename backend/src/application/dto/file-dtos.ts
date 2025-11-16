export interface CreateFileDto {
  /**
   * Nombre original del archivo subido por el usuario.
   */
  originalName: string;
  /**
   * Tipo MIME reportado por el cliente / multer (ej: 'application/pdf').
   */
  mimeType: string;
  /**
   * Tamaño del archivo en bytes.
   */
  size: number;
  /**
   * Buffer con el contenido del archivo. En la capa de infraestructura (multer)
   * lo obtendremos desde `req.file.buffer`.
   */
  buffer: Buffer;
}

export interface FileResponseDto {
  id: string;
  name: string;
  type: string;
  size: number;
  mimeType: string;
  /**
   * Ruta pública para acceder al archivo (ej: `/uploads/123456-report.pdf`).
   */
  url: string;
  uploadedAt: string;
}



