import { z } from 'zod';

export const uploadFileMetadataSchema = z.object({
  // Si más adelante quieres asociar el archivo a otro recurso (projectId, clientId, etc.),
  // se puede extender aquí.
  description: z.string().min(1).max(500).optional(),
});



