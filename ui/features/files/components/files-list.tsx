import { File } from '@/types/file';
import { FileItem } from './file-item';

interface FilesListProps {
  files: File[];
  onDelete?: (id: string) => void;
}

export function FilesList({ files, onDelete }: FilesListProps) {
  if (!files.length) {
    return (
      <div className="rounded-md border border-dashed bg-muted/40 p-6 text-center text-sm text-muted-foreground">
        Aún no has subido archivos. Usa el botón &quot;Subir archivo&quot; para
        comenzar.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <FileItem key={file.id} file={file} onDelete={onDelete} />
      ))}
    </div>
  );
}



