import { Project } from '../entities/project';
import { ProjectId } from '../value-objects/project-id';
import { ProjectStatus } from '../value-objects/project-status';

/**
 * Repository interface for Project aggregate.
 * Implementations will live in the infrastructure layer.
 */
export interface IProjectRepository {
  findById(id: ProjectId): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  findByStatus(status: ProjectStatus): Promise<Project[]>;
  create(project: Project): Promise<Project>;
  update(project: Project): Promise<Project>;
  delete(id: ProjectId): Promise<void>;
}


