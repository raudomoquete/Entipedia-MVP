import { db } from '../database/client';
import { Result } from '../../shared/errors/result';
import { AppError, InternalServerError } from '../../shared/errors/app-error';
import { logger } from '../logger/logger';

/**
 * Base repository implementing the Repository pattern
 */
export abstract class BaseRepository<T, TId = string> {
  protected readonly db = db;
  protected readonly logger = logger;

  /**
   * Find an entity by ID
   */
  abstract findById(id: TId): Promise<Result<T, AppError>>;

  /**
   * Find all entities
   */
  abstract findAll(): Promise<Result<T[], AppError>>;

  /**
   * Create a new entity
   */
  abstract create(entity: Partial<T>): Promise<Result<T, AppError>>;

  /**
   * Update an existing entity
   */
  abstract update(id: TId, entity: Partial<T>): Promise<Result<T, AppError>>;

  /**
   * Delete an entity by ID
   */
  abstract delete(id: TId): Promise<Result<void, AppError>>;

  /**
   * Handles database operations with error conversion
   */
  protected async executeOperation<U>(
    operation: () => Promise<U>
  ): Promise<Result<U, AppError>> {
    try {
      const result = await operation();
      return Result.success(result);
    } catch (error) {
      this.logger.error({ err: error }, 'Database operation failed');
      return Result.failure(
        error instanceof AppError
          ? error
          : new InternalServerError(
              error instanceof Error
                ? error.message
                : 'Database operation failed'
            )
      );
    }
  }
}

