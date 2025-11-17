'use client';

import { useState } from 'react';
import { ClientsTable } from '@/features/clients/components/clients-table';
import { CreateClientModal } from '@/features/clients/components/create-client-modal';
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from '@/features/clients/use-clients';
import { ClientFormValues } from '@/features/clients/components/client-form';

const PAGE_SIZE = 10;

export default function ClientsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useClients(page, PAGE_SIZE);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const handleCreate = async (values: ClientFormValues) => {
    await createClient.mutateAsync(values);
    setPage(1);
  };

  const handleUpdate = async (id: string, partial: Partial<ClientFormValues>) => {
    await updateClient.mutateAsync({ id, data: partial });
  };

  const handleDelete = async (id: string) => {
    await deleteClient.mutateAsync({ id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pl-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tus clientes con edición inline y paginación.
          </p>
        </div>
        <CreateClientModal onCreate={handleCreate} />
      </div>

      {isLoading || !data ? (
        <p className="text-sm text-muted-foreground pl-4">Cargando clientes...</p>
      ) : (
        <div className="pl-4">
          <ClientsTable
            data={data.items}
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
            onPageChange={setPage}
            onUpdateClient={handleUpdate}
            onDeleteClient={handleDelete}
          />
        </div>
      )}
    </div>
  );
}

