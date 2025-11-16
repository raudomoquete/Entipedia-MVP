import { Project } from '../entities/project';
import { ProjectId } from '../value-objects/project-id';
import { ProjectStatus } from '../value-objects/project-status';
import { Result } from '../../shared/errors/result';
import { AppError } from '../../shared/errors/app-error';

/**
 * Repository interface for Project aggregate.
 * Implementations will live in the infrastructure layer.
 * 
 * Note: We return Result<T, AppError> to be consistent with the rest
 * of the backend error-handling strategy.
 */
export interface IProjectRepository {
  findById(id: ProjectId): Promise<Result<Project, AppError>>;
  findAll(): Promise<Result<Project[], AppError>>;
  findByStatus(status: ProjectStatus): Promise<Result<Project[], AppError>>;
  create(project: Project): Promise<Result<Project, AppError>>;
  update(id: ProjectId, entity: Partial<Project>): Promise<Result<Project, AppError>>;
  delete(id: ProjectId): Promise<Result<void, AppError>>;
}


