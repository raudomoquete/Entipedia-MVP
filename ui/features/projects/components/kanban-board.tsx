import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Project, ProjectStatus } from '@/types/project';
import { ProjectCard } from './project-card';

const COLUMNS: { id: ProjectStatus; title: string }[] = [
  { id: 'PENDING', title: 'Pendiente' },
  { id: 'IN_PROGRESS', title: 'En progreso' },
  { id: 'IN_REVIEW', title: 'En revisión' },
  { id: 'DONE', title: 'Completado' },
  { id: 'CANCELLED', title: 'Cancelado' },
];

interface KanbanBoardProps {
  projects: Project[];
  onStatusChange: (id: string, status: ProjectStatus) => void;
  onDeleteProject: (id: string) => void;
}

export function KanbanBoard({
  projects,
  onStatusChange,
  onDeleteProject,
}: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const projectId = String(active.id);
    const newStatus = over.id as ProjectStatus;
    onStatusChange(projectId, newStatus);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {COLUMNS.map((column) => {
          const columnProjects = projects.filter(
            (project) => project.status === column.id
          );

          return (
            <div
              key={column.id}
              id={column.id}
              className="flex flex-col rounded-md border bg-muted/40 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold">{column.title}</h2>
                <span className="text-xs text-muted-foreground">
                  {columnProjects.length}
                </span>
              </div>
              <div className="flex-1 space-y-2">
                <SortableContext
                  items={columnProjects.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {columnProjects.map((project) => (
                    <div key={project.id} id={project.id}>
                      <ProjectCard
                        project={project}
                        onDelete={onDeleteProject}
                      />
                    </div>
                  ))}
                </SortableContext>
              </div>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}


