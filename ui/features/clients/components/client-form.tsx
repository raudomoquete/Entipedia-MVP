import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientType } from '@/types/client';
import { Button } from '@/components/ui/button';

const clientSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  type: z.enum(['PERSON', 'COMPANY']),
  email: z.string().email('Correo inválido').optional(),
  phone: z.string().min(3, 'Teléfono demasiado corto').optional(),
  lifetimeValue: z
    .number('Debe ser un número')
    .nonnegative('Debe ser mayor o igual a 0')
    .optional(),
});

export type ClientFormValues = {
  name: string;
  type: ClientType;
  email?: string;
  phone?: string;
  lifetimeValue?: number;
};

interface ClientFormProps {
  defaultValues?: Partial<ClientFormValues>;
  onSubmit: (values: ClientFormValues) => void | Promise<void>;
  submitLabel?: string;
}

export function ClientForm({
  defaultValues,
  onSubmit,
  submitLabel = 'Guardar',
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      type: 'PERSON',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Nombre</label>
        <input
          type="text"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/60"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Tipo</label>
          <select
            className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-foreground transition-all duration-200 focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/60 hover:bg-muted/50 cursor-pointer"
            {...register('type')}
          >
            <option value="PERSON">Persona</option>
            <option value="COMPANY">Empresa</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Valor DOP</label>
          <input
            type="number"
            step="0.01"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/60"
            {...register('lifetimeValue', { valueAsNumber: true })}
          />
          {errors.lifetimeValue && (
            <p className="text-xs text-destructive">
              {errors.lifetimeValue.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/60"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Teléfono</label>
          <input
            type="text"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/60"
            {...register('phone')}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
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


