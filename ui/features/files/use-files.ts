import { useApiMutation, useApiQuery } from '@/hooks/use-api';
import { fileService } from '@/services/file-service';
import { File } from '@/types/file';

const FILES_QUERY_KEY = ['files'];

export function useFiles() {
  return useApiQuery<File[]>(FILES_QUERY_KEY, {
    url: '/api/v1/files',
    method: 'GET',
  });
}

export function useUploadFile() {
  return useApiMutation<File, { file: Blob; filename: string }>(
    ({ file, filename }) => fileService.upload(file, filename),
    {
      invalidateQueries: [FILES_QUERY_KEY],
    }
  );
}

export function useDeleteFile() {
  return useApiMutation<void, { id: string }>(
    ({ id }) => fileService.delete(id),
    {
      invalidateQueries: [FILES_QUERY_KEY],
    }
  );
}



