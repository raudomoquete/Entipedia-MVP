/**
 * Command para eliminar un archivo.
 * La capa de aplicación se encargará de borrar tanto el registro en base de datos
 * como el archivo físico en el filesystem.
 */
export class DeleteFileCommand {
  constructor(public readonly id: string) {}
}



