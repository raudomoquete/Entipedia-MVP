import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Drizzle schema for projects table.
 * Mirrors the Project domain model.
 */
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull(),
  priority: text('priority').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
});


