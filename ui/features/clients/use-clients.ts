import { useApiMutation, useApiQuery } from '@/hooks/use-api';
import {
  clientService,
  CreateClientPayload,
  UpdateClientPayload,
} from '@/services/client-service';
import { Client, PaginatedClients } from '@/types/client';

const CLIENTS_QUERY_KEY = ['clients'];

export function useClients(page: number, pageSize: number) {
  return useApiQuery<PaginatedClients>(
    [...CLIENTS_QUERY_KEY, page.toString(), pageSize.toString()],
    {
      url: '/api/v1/clients',
      method: 'GET',
      params: { page, pageSize },
    }
  );
}

export function useCreateClient() {
  return useApiMutation<Client, CreateClientPayload>(
    (payload) => clientService.create(payload),
    {
      invalidateQueries: [CLIENTS_QUERY_KEY],
    }
  );
}

export function useUpdateClient() {
  return useApiMutation<Client, { id: string; data: UpdateClientPayload }>(
    ({ id, data }) => clientService.update(id, data),
    {
      invalidateQueries: [CLIENTS_QUERY_KEY],
    }
  );
}

export function useDeleteClient() {
  return useApiMutation<void, { id: string }>(
    ({ id }) => clientService.delete(id),
    {
      invalidateQueries: [CLIENTS_QUERY_KEY],
    }
  );
}


