export interface CreateClientDto {
  name: string;
  type: string; // PERSON | COMPANY
  email?: string;
  phone?: string;
  lifetimeValue?: number; // monto en DOP
}

export interface UpdateClientDto {
  name?: string;
  type?: string;
  email?: string;
  phone?: string;
  lifetimeValue?: number;
}

export interface ClientResponseDto {
  id: string;
  name: string;
  type: string;
  email?: string;
  phone?: string;
  lifetimeValue?: number;
  createdAt: string;
}

export interface PaginatedClientsResponseDto {
  items: ClientResponseDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}


