'use client';

import { useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadFileModalProps {
  onUpload: (file: { blob: Blob; filename: string }) => void | Promise<void>;
}

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'];

export function UploadFileModal({ onUpload }: UploadFileModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isImage = useMemo(() => {
    if (!selectedFile) return false;
    return IMAGE_TYPES.includes(selectedFile.type);
  }, [selectedFile]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      // Si es una imagen, crear preview
      if (IMAGE_TYPES.includes(file.type)) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!selectedFile) return;
    await onUpload({ blob: selectedFile, filename: selectedFile.name });
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setOpen(false);
  };

  const handleClose = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <Upload className="h-4 w-4" />
        Subir archivo
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur">
          <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Subir archivo</h2>
              <button
                type="button"
                className="text-sm text-muted-foreground hover:underline"
                onClick={handleClose}
              >
                Cerrar
              </button>
            </div>

            <div
              {...getRootProps()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-8 text-center text-sm transition ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/30 bg-muted/30'
              }`}
            >
              <input {...getInputProps()} />
              {isImage && previewUrl ? (
                <div className="mb-4 w-full space-y-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mx-auto max-h-48 max-w-full rounded-md object-contain"
                  />
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    <span>Vista previa de imagen</span>
                  </div>
                </div>
              ) : (
                <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
              )}
              {isDragActive ? (
                <p>Suelta el archivo aquí...</p>
              ) : (
                <p>
                  Arrastra y suelta un archivo aquí, o haz clic para
                  seleccionarlo
                </p>
              )}
              {selectedFile && (
                <div className="mt-3 flex w-full items-center justify-between gap-2 rounded bg-background px-3 py-2 text-xs">
                  <div className="flex-1 truncate">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                      {isImage && ' · Imagen'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!selectedFile}
                onClick={handleSubmit}
              >
                Subir
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



