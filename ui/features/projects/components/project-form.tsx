import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectPriority, ProjectStatus } from '@/types/project';
import { Button } from '@/components/ui/button';

const projectSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  status: z
    .enum(['PENDING', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED'])
    .default('PENDING'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});

export type ProjectFormValues = {
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
};

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => void | Promise<void>;
  submitLabel?: string;
}

export function ProjectForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Guardar',
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div className="space-y-1">
        <label className="text-sm font-medium">Nombre</label>
        <input
          type="text"
          className="w-full rounded-md border px-3 py-2 text-sm"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Descripción</label>
        <textarea
          rows={3}
          className="w-full rounded-md border px-3 py-2 text-sm"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Estado</label>
          <select
            className="w-full rounded-md border px-3 py-2 text-sm"
            {...register('status')}
          >
            <option value="PENDING">Pendiente</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="IN_REVIEW">En revisión</option>
            <option value="DONE">Completado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Prioridad</label>
          <select
            className="w-full rounded-md border px-3 py-2 text-sm"
            {...register('priority')}
          >
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}


