import { FileId } from '../value-objects/file-id';
import { FileType } from '../value-objects/file-type';

export interface FileProps {
  id: FileId;
  name: string;
  type: FileType;
  sizeInBytes: number;
  mimeType: string;
  path: string;
  uploadedAt: Date;
}

/**
 * Entidad de dominio que representa un archivo almacenado en el sistema.
 * La lógica de negocio relacionada con archivos (renombrar, validar tamaño, etc.)
 * debería vivir aquí.
 */
export class File {
  private props: FileProps;

  private constructor(props: FileProps) {
    this.props = props;
  }

  static create(props: FileProps): File {
    return new File(props);
  }

  get id(): FileId {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get type(): FileType {
    return this.props.type;
  }

  get sizeInBytes(): number {
    return this.props.sizeInBytes;
  }

  get mimeType(): string {
    return this.props.mimeType;
  }

  get path(): string {
    return this.props.path;
  }

  get uploadedAt(): Date {
    return this.props.uploadedAt;
  }

  rename(newName: string): void {
    const trimmed = newName.trim();
    if (!trimmed) {
      throw new Error('File name cannot be empty');
    }
    this.props.name = trimmed;
  }
}


