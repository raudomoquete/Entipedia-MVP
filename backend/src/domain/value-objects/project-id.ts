/**
 * Value Object representing a Project ID.
 * For now it's just a branded string, but this allows us to evolve later
 * (e.g. UUID validation) without changing the rest of the domain.
 */
export type ProjectId = string & { readonly brand: unique symbol };

export function createProjectId(value: string): ProjectId {
  // In case we want to add validation later (e.g. UUID format), this is the place.
  return value as ProjectId;
}


