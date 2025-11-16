import { CreateFileDto } from '../dto/file-dtos';

/**
 * Command para subir un archivo.
 *
 * La capa de infraestructura (REST + multer) se encargará de construir
 * el `CreateFileDto` a partir de `req.file` (multipart/form-data).
 */
export class UploadFileCommand {
  constructor(public readonly data: CreateFileDto) {}
}



