import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadFileModalProps {
  onUpload: (file: { blob: Blob; filename: string }) => void | Promise<void>;
}

export function UploadFileModal({ onUpload }: UploadFileModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
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
                onClick={() => setOpen(false)}
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
              <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
              {isDragActive ? (
                <p>Suelta el archivo aquí...</p>
              ) : (
                <p>
                  Arrastra y suelta un archivo aquí, o haz clic para
                  seleccionarlo
                </p>
              )}
              {selectedFile && (
                <div className="mt-3 flex items-center justify-between gap-2 rounded bg-background px-3 py-1 text-xs">
                  <span className="truncate">{selectedFile.name}</span>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
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



