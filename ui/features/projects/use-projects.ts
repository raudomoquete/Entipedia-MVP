import { useApiMutation, useApiQuery } from '@/hooks/use-api';
import {
  projectService,
  CreateProjectPayload,
  UpdateProjectPayload,
} from '@/services/project-service';
import { Project } from '@/types/project';

const PROJECTS_QUERY_KEY = ['projects'];

export function useProjects() {
  return useApiQuery<Project[]>(PROJECTS_QUERY_KEY, {
    url: '/api/v1/projects',
    method: 'GET',
  });
}

export function useCreateProject() {
  return useApiMutation<Project, CreateProjectPayload>(
    (payload) => projectService.create(payload),
    {
      invalidateQueries: [PROJECTS_QUERY_KEY],
    }
  );
}

export function useUpdateProject() {
  return useApiMutation<Project, { id: string; data: UpdateProjectPayload }>(
    ({ id, data }) => projectService.update(id, data),
    {
      invalidateQueries: [PROJECTS_QUERY_KEY],
    }
  );
}

export function useDeleteProject() {
  return useApiMutation<void, { id: string }>(
    ({ id }) => projectService.delete(id),
    {
      invalidateQueries: [PROJECTS_QUERY_KEY],
    }
  );
}


