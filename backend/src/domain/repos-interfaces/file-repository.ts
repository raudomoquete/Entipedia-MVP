import { File } from '../entities/file';
import { FileId } from '../value-objects/file-id';
import { FileType } from '../value-objects/file-type';
import { Result } from '../../shared/errors/result';
import { AppError } from '../../shared/errors/app-error';

/**
 * Repository interface para el agregado File.
 * Las implementaciones concretas vivirán en la capa de infraestructura.
 */
export interface IFileRepository {
  findById(id: FileId): Promise<Result<File, AppError>>;
  findAll(): Promise<Result<File[], AppError>>;
  findByType(type: FileType): Promise<Result<File[], AppError>>;
  create(file: File): Promise<Result<File, AppError>>;
  update(id: FileId, entity: Partial<File>): Promise<Result<File, AppError>>;
  delete(id: FileId): Promise<Result<void, AppError>>;
}


