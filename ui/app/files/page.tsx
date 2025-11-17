'use client';

import { useState } from 'react';
import { useFiles, useDeleteFile, useUploadFile } from '@/features/files';
import { FilesList, UploadFileModal } from '@/features/files';
import { useApiError } from '@/hooks/use-api';

export default function FilesPage() {
  const { data, isLoading, isError, error, refetch } = useFiles();
  const deleteFileMutation = useDeleteFile();
  const uploadFileMutation = useUploadFile();
  const { handleError } = useApiError();
  const [localError, setLocalError] = useState<string | null>(null);

  const files = data ?? [];

  const handleDelete = async (id: string) => {
    setLocalError(null);
    try {
      await deleteFileMutation.mutateAsync({ id });
      // Forzar refetch para asegurar que la lista se actualice
      await refetch();
    } catch (err) {
      setLocalError(handleError(err));
    }
  };

  const handleUpload = async (file: { blob: Blob; filename: string }) => {
    setLocalError(null);
    try {
      await uploadFileMutation.mutateAsync({
        file: file.blob,
        filename: file.filename,
      });
      // Forzar refetch para asegurar que la lista se actualice después de subir
      await refetch();
    } catch (err) {
      setLocalError(handleError(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 pl-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Archivos</h1>
          <p className="text-sm text-muted-foreground">
            Centraliza y gestiona la documentación de tus proyectos.
          </p>
        </div>
        <UploadFileModal onUpload={handleUpload} />
      </div>

      {(isError || localError) && (
        <div className="pl-4">
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {localError || handleError(error)}
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted-foreground pl-4">Cargando archivos...</p>
      ) : (
        <div className="pl-4">
          <FilesList files={files} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}


