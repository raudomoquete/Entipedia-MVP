import { eq } from 'drizzle-orm';
import { BaseRepository } from './base-repository';
import { projects } from '../database/schema';
import { Project } from '../../domain/entities/project';
import { ProjectId, createProjectId } from '../../domain/value-objects/project-id';
import { ProjectName } from '../../domain/value-objects/project-name';
import { ProjectStatus } from '../../domain/value-objects/project-status';
import { ProjectPriority } from '../../domain/value-objects/project-priority';
import { IProjectRepository } from '../../domain/repos-interfaces/project-repository';
import { Result } from '../../shared/errors/result';
import { AppError, NotFoundError } from '../../shared/errors/app-error';

type ProjectRow = typeof projects.$inferSelect;

export class ProjectRepository
  extends BaseRepository<Project, ProjectId>
  implements IProjectRepository
{
  private mapToDomain(row: ProjectRow): Project {
    return Project.create({
      id: createProjectId(row.id),
      name: ProjectName.create(row.name),
      description: row.description,
      status: row.status as ProjectStatus,
      priority: row.priority as ProjectPriority,
      createdAt: row.createdAt,
    });
  }

  async findById(id: ProjectId): Promise<Result<Project, AppError>> {
    return this.executeOperation(async () => {
      const rows = await this.db.select().from(projects).where(eq(projects.id, id));
      const row = rows[0];
      if (!row) {
        throw new NotFoundError('Project', id);
      }
      return this.mapToDomain(row);
    });
  }

  async findAll(): Promise<Result<Project[], AppError>> {
    return this.executeOperation(async () => {
      const rows = await this.db.select().from(projects);
      return rows.map((row) => this.mapToDomain(row));
    });
  }

  async findByStatus(status: ProjectStatus): Promise<Result<Project[], AppError>> {
    return this.executeOperation(async () => {
      const rows = await this.db.select().from(projects).where(eq(projects.status, status));
      return rows.map((row) => this.mapToDomain(row));
    });
  }

  // Implementations for BaseRepository abstract methods

  async create(
    project: Project
  ): Promise<Result<Project, AppError>> {
    return this.executeOperation(async () => {
      const [row] = await this.db
        .insert(projects)
        .values({
          id: project.id,
          name: project.name.getValue(),
          description: project.description,
          status: project.status,
          priority: project.priority,
          // createdAt se omite para que PostgreSQL use el default (now())
        })
        .returning();

      return this.mapToDomain(row);
    });
  }

  async update(
    projectId: ProjectId,
    entity: Partial<Project>
  ): Promise<Result<Project, AppError>> {
    return this.executeOperation(async () => {
      // First, fetch existing project to merge changes
      const existingResult = await this.findById(projectId);
      if (!existingResult.success) {
        throw existingResult.error;
      }
      const existing = existingResult.value;

      const project = Project.create({
        id: projectId,
        name: entity.name ?? existing.name,
        description: entity.description ?? existing.description,
        status: entity.status ?? existing.status,
        priority: entity.priority ?? existing.priority,
        createdAt: existing.createdAt,
      });

      const [row] = await this.db
        .update(projects)
        .set({
          name: project.name.getValue(),
          description: project.description,
          status: project.status,
          priority: project.priority,
        })
        .where(eq(projects.id, projectId))
        .returning();

      if (!row) {
        throw new NotFoundError('Project', projectId);
      }

      return this.mapToDomain(row);
    });
  }

  async delete(id: ProjectId): Promise<Result<void, AppError>> {
    return this.executeOperation(async () => {
      const result = await this.db.delete(projects).where(eq(projects.id, id));
      // drizzle returns { rowCount?: number } depending on driver; we won't rely on it strictly here
      // If needed, we could check result.rowCount and throw NotFoundError when 0.
      return;
    });
  }
}


