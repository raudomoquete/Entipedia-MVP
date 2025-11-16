import { IProjectRepository } from '../../domain/repos-interfaces/project-repository';
import { Project } from '../../domain/entities/project';
import { ProjectName } from '../../domain/value-objects/project-name';
import { ProjectStatus } from '../../domain/value-objects/project-status';
import { ProjectPriority } from '../../domain/value-objects/project-priority';
import { createProjectId } from '../../domain/value-objects/project-id';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectResponseDto,
} from '../dto/project-dtos';
import { Result } from '../../shared/errors/result';
import { AppError } from '../../shared/errors/app-error';

export class ProjectService {
  constructor(private readonly projectRepository: IProjectRepository) {}

  private toResponseDto(project: Project): ProjectResponseDto {
    return {
      id: project.id,
      name: project.name.getValue(),
      description: project.description,
      status: project.status,
      priority: project.priority,
      createdAt: project.createdAt.toISOString(),
    };
  }

  async createProject(
    dto: CreateProjectDto
  ): Promise<Result<ProjectResponseDto, AppError>> {
    const project = Project.create({
      id: createProjectId(crypto.randomUUID()),
      name: ProjectName.create(dto.name),
      description: dto.description,
      status: dto.status as ProjectStatus,
      priority: dto.priority as ProjectPriority,
      createdAt: new Date(),
    });

    const result = await this.projectRepository.create(project);
    if (!result.success) {
      return Result.failure(result.error);
    }

    return Result.success(this.toResponseDto(result.value));
  }

  async updateProject(
    id: string,
    dto: UpdateProjectDto
  ): Promise<Result<ProjectResponseDto, AppError>> {
    const projectId = createProjectId(id);

    // Usamos un tipo específico en lugar de Partial<Project> porque
    // las propiedades expuestas en Project son de solo lectura (getters).
    const partial: {
      name?: ProjectName;
      description?: string;
      status?: ProjectStatus;
      priority?: ProjectPriority;
    } = {};
    if (dto.name !== undefined) {
      partial.name = ProjectName.create(dto.name);
    }
    if (dto.description !== undefined) {
      partial.description = dto.description;
    }
    if (dto.status !== undefined) {
      partial.status = dto.status as ProjectStatus;
    }
    if (dto.priority !== undefined) {
      partial.priority = dto.priority as ProjectPriority;
    }

    const result = await this.projectRepository.update(projectId, partial);
    if (!result.success) {
      return Result.failure(result.error);
    }

    return Result.success(this.toResponseDto(result.value));
  }

  async deleteProject(
    id: string
  ): Promise<Result<void, AppError>> {
    const projectId = createProjectId(id);
    return this.projectRepository.delete(projectId);
  }

  async getAllProjects(): Promise<Result<ProjectResponseDto[], AppError>> {
    const result = await this.projectRepository.findAll();
    if (!result.success) {
      return Result.failure(result.error);
    }

    const projects = result.value.map((project) => this.toResponseDto(project));
    return Result.success(projects);
  }

  async getProjectById(
    id: string
  ): Promise<Result<ProjectResponseDto, AppError>> {
    const projectId = createProjectId(id);
    const result = await this.projectRepository.findById(projectId);
    if (!result.success) {
      return Result.failure(result.error);
    }

    return Result.success(this.toResponseDto(result.value));
  }
}


