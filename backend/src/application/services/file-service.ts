import { IFileRepository } from '../../domain/repos-interfaces/file-repository';
import { File } from '../../domain/entities/file';
import { FileType } from '../../domain/value-objects/file-type';
import { createFileId } from '../../domain/value-objects/file-id';
import { LocalFileStorageService } from '../../infrastructure/storage/local-file-storage-service';
import { CreateFileDto, FileResponseDto } from '../dto/file-dtos';
import { Result } from '../../shared/errors/result';
import { AppError } from '../../shared/errors/app-error';

/**
 * Servicio de aplicación para la gestión de archivos.
 * Orquesta acceso a repositorio + almacenamiento en filesystem.
 */
export class FileService {
  constructor(
    private readonly fileRepository: IFileRepository,
    private readonly storageService: LocalFileStorageService
  ) {}

  private detectFileTypeByExtension(filename: string): FileType {
    const extension = filename.split('.').pop()?.toLowerCase() ?? '';

    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(extension)) {
      return FileType.IMAGE;
    }
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) {
      return FileType.VIDEO;
    }
    if (['mp3', 'wav', 'aac', 'ogg', 'flac'].includes(extension)) {
      return FileType.AUDIO;
    }
    if (
      [
        'pdf',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'ppt',
        'pptx',
        'txt',
        'md',
        'csv',
      ].includes(extension)
    ) {
      return FileType.DOCUMENT;
    }

    return FileType.OTHER;
  }

  private toResponseDto(file: File): FileResponseDto {
    return {
      id: file.id,
      name: file.name,
      type: file.type,
      size: file.sizeInBytes,
      mimeType: file.mimeType,
      url: this.storageService.getFileUrl(file.path),
      uploadedAt: file.uploadedAt.toISOString(),
    };
  }

  /**
   * Sube un archivo, lo guarda en disco y persiste su metadata en la base de datos.
   */
  async uploadFile(
    dto: CreateFileDto
  ): Promise<Result<FileResponseDto, AppError>> {
    // Guardar el archivo físicamente (generando un nombre único)
    const stored = await this.storageService.saveFile(
      dto.buffer,
      dto.originalName,
      dto.mimeType
    );

    const file = File.create({
      id: createFileId(crypto.randomUUID()),
      name: stored.originalName,
      type: this.detectFileTypeByExtension(stored.originalName),
      sizeInBytes: stored.size,
      mimeType: stored.mimeType,
      path: stored.relativePath,
      uploadedAt: stored.createdAt,
    });

    const result = await this.fileRepository.create(file);
    if (!result.success) {
      // Si falló la persistencia en DB, intentamos limpiar el archivo físico.
      try {
        await this.storageService.deleteFile(stored.relativePath);
      } catch {
        // Si también falla, lo registraría un logger; aquí lo ignoramos.
      }
      return Result.failure(result.error);
    }

    return Result.success(this.toResponseDto(result.value));
  }

  /**
   * Elimina un archivo tanto del repositorio como del filesystem.
   */
  async deleteFile(id: string): Promise<Result<void, AppError>> {
    const fileId = createFileId(id);

    const existing = await this.fileRepository.findById(fileId);
    if (!existing.success) {
      return Result.failure(existing.error);
    }

    const deleteResult = await this.fileRepository.delete(fileId);
    if (!deleteResult.success) {
      return Result.failure(deleteResult.error);
    }

    // Borrado best-effort del archivo físico.
    await this.storageService.deleteFile(existing.value.path);

    return Result.success(undefined);
  }

  async getAllFiles(): Promise<Result<FileResponseDto[], AppError>> {
    const result = await this.fileRepository.findAll();
    if (!result.success) {
      return Result.failure(result.error);
    }

    const mapped = result.value.map((file) => this.toResponseDto(file));
    return Result.success(mapped);
  }

  async getFileById(id: string): Promise<Result<FileResponseDto, AppError>> {
    const fileId = createFileId(id);
    const result = await this.fileRepository.findById(fileId);
    if (!result.success) {
      return Result.failure(result.error);
    }

    return Result.success(this.toResponseDto(result.value));
  }
}



