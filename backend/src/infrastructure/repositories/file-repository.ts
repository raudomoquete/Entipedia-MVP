import { eq } from 'drizzle-orm';
import { BaseRepository } from './base-repository';
import { files } from '../database/schema';
import { File } from '../../domain/entities/file';
import { FileId, createFileId } from '../../domain/value-objects/file-id';
import { FileType } from '../../domain/value-objects/file-type';
import { IFileRepository } from '../../domain/repos-interfaces/file-repository';
import { Result } from '../../shared/errors/result';
import { AppError, NotFoundError } from '../../shared/errors/app-error';

type FileRow = typeof files.$inferSelect;

export class FileRepository
  extends BaseRepository<File, FileId>
  implements IFileRepository
{
  private mapToDomain(row: FileRow): File {
    return File.create({
      id: createFileId(row.id),
      name: row.name,
      type: row.fileType as FileType,
      sizeInBytes: row.size,
      mimeType: row.mimeType,
      path: row.filePath,
      uploadedAt: row.createdAt,
    });
  }

  async findById(id: FileId): Promise<Result<File, AppError>> {
    return this.executeOperation(async () => {
      const rows = await this.db
        .select()
        .from(files)
        .where(eq(files.id, id));

      const row = rows[0];
      if (!row) {
        throw new NotFoundError('File', id);
      }

      return this.mapToDomain(row);
    });
  }

  async findAll(): Promise<Result<File[], AppError>> {
    return this.executeOperation(async () => {
      const rows = await this.db.select().from(files);
      return rows.map((row) => this.mapToDomain(row));
    });
  }

  async findByType(type: FileType): Promise<Result<File[], AppError>> {
    return this.executeOperation(async () => {
      const rows = await this.db
        .select()
        .from(files)
        .where(eq(files.fileType, type));

      return rows.map((row) => this.mapToDomain(row));
    });
  }

  async create(file: File): Promise<Result<File, AppError>> {
    return this.executeOperation(async () => {
      const [row] = await this.db
        .insert(files)
        .values({
          id: file.id,
          name: file.name,
          description: '', // TODO: extender entidad File para almacenar descripción si se requiere
          fileType: file.type,
          filePath: file.path,
          mimeType: file.mimeType,
          size: file.sizeInBytes,
          createdAt: file.uploadedAt,
        })
        .returning();

      return this.mapToDomain(row);
    });
  }

  async update(
    fileId: FileId,
    entity: Partial<File>
  ): Promise<Result<File, AppError>> {
    return this.executeOperation(async () => {
      const existingResult = await this.findById(fileId);
      if (!existingResult.success) {
        throw existingResult.error;
      }
      const existing = existingResult.value;

      const updated = File.create({
        id: fileId,
        name: entity.name ?? existing.name,
        type: entity.type ?? existing.type,
        sizeInBytes: entity.sizeInBytes ?? existing.sizeInBytes,
        mimeType: entity.mimeType ?? existing.mimeType,
        path: entity.path ?? existing.path,
        uploadedAt: existing.uploadedAt,
      });

      const [row] = await this.db
        .update(files)
        .set({
          name: updated.name,
          fileType: updated.type,
          filePath: updated.path,
          mimeType: updated.mimeType,
          size: updated.sizeInBytes,
        })
        .where(eq(files.id, fileId))
        .returning();

      if (!row) {
        throw new NotFoundError('File', fileId);
      }

      return this.mapToDomain(row);
    });
  }

  async delete(id: FileId): Promise<Result<void, AppError>> {
    return this.executeOperation(async () => {
      await this.db.delete(files).where(eq(files.id, id));
      return;
    });
  }
}


