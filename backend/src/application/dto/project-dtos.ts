export interface CreateProjectDto {
  name: string;
  description: string;
  status: string;
  priority: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: string;
  priority?: string;
}

export interface ProjectResponseDto {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
}


