export type FileType = 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'OTHER';

export interface File {
  id: string;
  name: string;
  type: FileType;
  size: number;
  mimeType: string;
  /**
   * URL pública servida por el backend (ej: /uploads/123456-report.pdf)
   */
  url: string;
  uploadedAt: string;
}



