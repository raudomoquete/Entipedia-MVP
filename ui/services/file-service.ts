import { apiClient } from '@/lib/api-client';
import { File } from '@/types/file';

export interface UploadFilePayload {
  file: File | Blob;
}

class FileService {
  private readonly baseUrl = '/api/v1/files';

  async getAll(): Promise<File[]> {
    const response = await apiClient.get<File[]>(this.baseUrl);
    return response.data;
  }

  async getById(id: string): Promise<File> {
    const response = await apiClient.get<File>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async upload(file: Blob, filename: string): Promise<File> {
    const formData = new FormData();
    formData.append('file', file, filename);

    const response = await apiClient.post<File>(this.baseUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const fileService = new FileService();



