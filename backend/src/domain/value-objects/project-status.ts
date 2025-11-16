/**
 * Possible statuses for a Project in the system.
 * These values are used both in the domain and persisted in the database.
 */
export enum ProjectStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}


