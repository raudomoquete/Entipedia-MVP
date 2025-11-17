import { Download, Trash2, File as FileIcon, Image, Music, Video } from 'lucide-react';
import { File } from '@/types/file';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

interface FileItemProps {
  file: File;
  onDownload?: (file: File) => void;
  onDelete?: (id: string) => void;
}

function getFileIcon(type: File['type']) {
  switch (type) {
    case 'IMAGE':
      return Image;
    case 'AUDIO':
      return Music;
    case 'VIDEO':
      return Video;
    case 'DOCUMENT':
    default:
      return FileIcon;
  }
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function FileItem({ file, onDownload, onDelete }: FileItemProps) {
  const Icon = getFileIcon(file.type);
  const isImage = file.type === 'IMAGE';

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm shadow-sm',
        'hover:bg-accent/40 transition-colors'
      )}
    >
      <div className="flex items-center gap-3">
        {isImage ? (
          <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
            <img
              src={file.url}
              alt={file.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                // Si la imagen falla al cargar, mostrar el icono
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="absolute hidden h-full w-full items-center justify-center bg-muted">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <div className="space-y-0.5">
          <p className="font-medium leading-tight">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {file.type} · {formatSize(file.size)} ·{' '}
            {new Date(file.uploadedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onDownload ? (
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label="Descargar archivo"
            onClick={() => onDownload(file)}
          >
            <Download className="h-4 w-4" />
          </Button>
        ) : (
          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            aria-label="Descargar archivo"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Download className="h-4 w-4" />
          </a>
        )}

        {onDelete && (
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            aria-label="Eliminar archivo"
            onClick={() => onDelete(file.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}



