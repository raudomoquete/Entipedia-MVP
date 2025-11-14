import { apiClient } from '@/lib/api-client';
import { ApiResponse, PaginatedResponse } from '@/types/api';

/**
 * Example service demonstrating API service pattern
 * Services handle all API calls for a specific domain/resource
 */

export interface ExampleEntity {
  id: string;
  name: string;
  createdAt: string;
}

class ExampleService {
  private readonly baseUrl = '/api/v1/examples';

  async getAll(): Promise<PaginatedResponse<ExampleEntity>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<ExampleEntity>>>(
      this.baseUrl
    );
    return response.data.data;
  }

  async getById(id: string): Promise<ExampleEntity> {
    const response = await apiClient.get<ApiResponse<ExampleEntity>>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async create(data: Partial<ExampleEntity>): Promise<ExampleEntity> {
    const response = await apiClient.post<ApiResponse<ExampleEntity>>(this.baseUrl, data);
    return response.data.data;
  }

  async update(id: string, data: Partial<ExampleEntity>): Promise<ExampleEntity> {
    const response = await apiClient.put<ApiResponse<ExampleEntity>>(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const exampleService = new ExampleService();

