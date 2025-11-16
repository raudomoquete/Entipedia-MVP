/**
 * Value Object para el identificador de un archivo.
 * Usamos un branded string para poder añadir validaciones (UUID, etc.) más adelante
 * sin romper el resto del dominio.
 */
export type FileId = string & { readonly brand: unique symbol };

export function createFileId(value: string): FileId {
  // Aquí podríamos validar formato UUID en el futuro.
  return value as FileId;
}


