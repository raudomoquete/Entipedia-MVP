'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ClientForm, ClientFormValues } from './client-form';
import { Button } from '@/components/ui/button';

interface CreateClientModalProps {
  onCreate: (values: ClientFormValues) => void | Promise<void>;
}

export function CreateClientModal({ onCreate }: CreateClientModalProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (values: ClientFormValues) => {
    await onCreate(values);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Nuevo cliente
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur">
          <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Crear cliente</h2>
              <button
                type="button"
                className="text-sm text-muted-foreground hover:underline"
                onClick={() => setOpen(false)}
              >
                Cerrar
              </button>
            </div>

            <ClientForm submitLabel="Crear" onSubmit={handleSubmit} />
          </div>
        </div>
      )}
    </>
  );
}


