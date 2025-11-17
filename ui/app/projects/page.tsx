'use client';

import { KanbanBoard } from '@/features/projects/components/kanban-board';
import { CreateProjectModal } from '@/features/projects/components/create-project-modal';
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from '@/features/projects/use-projects';
import { ProjectStatus } from '@/types/project';
import { ProjectFormValues } from '@/features/projects/components/project-form';

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const handleCreate = async (values: ProjectFormValues) => {
    await createProject.mutateAsync(values);
  };

  const handleStatusChange = async (id: string, status: ProjectStatus) => {
    await updateProject.mutateAsync({ id, data: { status } });
  };

  const handleDelete = async (id: string) => {
    await deleteProject.mutateAsync({ id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pl-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Proyectos</h1>
          <p className="text-muted-foreground">
            Gestiona tus proyectos en un tablero Kanban.
          </p>
        </div>
        <CreateProjectModal onCreate={handleCreate} />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground pl-4">Cargando proyectos...</p>
      ) : (
        <div className="pl-4">
          <KanbanBoard
            projects={projects}
            onStatusChange={handleStatusChange}
            onDeleteProject={handleDelete}
          />
        </div>
      )}
    </div>
  );
}

