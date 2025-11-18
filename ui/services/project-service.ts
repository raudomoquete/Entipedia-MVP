import { apiClient } from '@/lib/api-client';
import { Project } from '@/types/project';

export interface CreateProjectPayload {
  name: string;
  description: string;
  status?: Project['status'];
  priority?: Project['priority'];
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  status?: Project['status'];
  priority?: Project['priority'];
}

class ProjectService {
  private readonly baseUrl = '/api/v1/projects';

  async getAll(): Promise<Project[]> {
    const response = await apiClient.get<Project[]>(this.baseUrl);
    return response.data;
  }

  async getById(id: string): Promise<Project> {
    const response = await apiClient.get<Project>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(payload: CreateProjectPayload): Promise<Project> {
    const response = await apiClient.post<Project>(this.baseUrl, payload);
    return response.data;
  }

  async update(id: string, payload: UpdateProjectPayload): Promise<Project> {
    const response = await apiClient.patch<Project>(
      `${this.baseUrl}/${id}`,
      payload
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const projectService = new ProjectService();


