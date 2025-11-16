import { apiClient } from '@/lib/api-client';
import { Client, PaginatedClients, ClientType } from '@/types/client';

export interface CreateClientPayload {
  name: string;
  type: ClientType;
  email?: string;
  phone?: string;
  lifetimeValue?: number;
}

export interface UpdateClientPayload {
  name?: string;
  type?: ClientType;
  email?: string;
  phone?: string;
  lifetimeValue?: number;
}

class ClientService {
  private readonly baseUrl = '/api/v1/clients';

  async getAll(page: number, pageSize: number): Promise<PaginatedClients> {
    const response = await apiClient.get<PaginatedClients>(this.baseUrl, {
      params: { page, pageSize },
    });
    return response.data;
  }

  async getById(id: string): Promise<Client> {
    const response = await apiClient.get<Client>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(payload: CreateClientPayload): Promise<Client> {
    const response = await apiClient.post<Client>(this.baseUrl, payload);
    return response.data;
  }

  async update(id: string, payload: UpdateClientPayload): Promise<Client> {
    const response = await apiClient.patch<Client>(
      `${this.baseUrl}/${id}`,
      payload
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const clientService = new ClientService();


