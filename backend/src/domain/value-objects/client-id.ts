/**
 * Value Object para el identificador de Cliente.
 * Igual que con ProjectId, usamos un branded type para poder evolucionar
 * la validación (UUID, etc.) sin romper el resto del dominio.
 */
export type ClientId = string & { readonly brand: unique symbol };

export function createClientId(value: string): ClientId {
  // Punto central para validaciones futuras (formato UUID, etc.)
  return value as ClientId;
}


