'use client';

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
import { cn } from '@/lib/cn';

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
              className={cn(
                'flex flex-col rounded-md border p-3 transition-colors',
                column.id === 'DONE' && 'bg-success/5 border-success/20',
                column.id === 'CANCELLED' && 'bg-destructive/5 border-destructive/20',
                column.id === 'IN_PROGRESS' && 'bg-info/5 border-info/20',
                column.id === 'IN_REVIEW' && 'bg-warning/5 border-warning/20',
                !['DONE', 'CANCELLED', 'IN_PROGRESS', 'IN_REVIEW'].includes(column.id) &&
                  'bg-muted/40 border-border'
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <h2
                  className={cn(
                    'text-sm font-semibold',
                    column.id === 'DONE' && 'text-success',
                    column.id === 'CANCELLED' && 'text-destructive',
                    column.id === 'IN_PROGRESS' && 'text-info',
                    column.id === 'IN_REVIEW' && 'text-warning',
                    !['DONE', 'CANCELLED', 'IN_PROGRESS', 'IN_REVIEW'].includes(column.id) &&
                      'text-foreground'
                  )}
                >
                  {column.title}
                </h2>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    column.id === 'DONE' && 'bg-success/20 text-success-foreground',
                    column.id === 'CANCELLED' && 'bg-destructive/20 text-destructive-foreground',
                    column.id === 'IN_PROGRESS' && 'bg-info/20 text-info-foreground',
                    column.id === 'IN_REVIEW' && 'bg-warning/20 text-warning-foreground',
                    !['DONE', 'CANCELLED', 'IN_PROGRESS', 'IN_REVIEW'].includes(column.id) &&
                      'bg-muted text-muted-foreground'
                  )}
                >
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


