import { Trash2 } from 'lucide-react';
import { Project } from '@/types/project';
import { cn } from '@/lib/cn';

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <div
      className={cn(
        'group rounded-md border bg-background p-3 text-sm shadow-sm transition-shadow',
        'hover:shadow-md'
      )}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className="font-medium leading-snug">{project.name}</h3>
        {onDelete && (
          <button
            type="button"
            aria-label="Eliminar proyecto"
            className="rounded p-1 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
            onClick={() => onDelete(project.id)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      <p className="line-clamp-3 text-xs text-muted-foreground">
        {project.description}
      </p>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span
          className={cn(
            'rounded px-2 py-0.5 font-medium',
            project.priority === 'URGENT' && 'bg-destructive/10 text-destructive',
            project.priority === 'HIGH' && 'bg-warning/20 text-warning-foreground',
            project.priority === 'MEDIUM' && 'bg-info/20 text-info-foreground',
            project.priority === 'LOW' && 'bg-muted text-muted-foreground'
          )}
        >
          {project.priority}
        </span>
        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}


