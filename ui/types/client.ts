export type ClientType = 'PERSON' | 'COMPANY';

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  email?: string;
  phone?: string;
  lifetimeValue?: number;
  createdAt: string;
}

export interface PaginatedClients {
  items: Client[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}


