import { pgTable, uuid, text, timestamp, bigint } from 'drizzle-orm/pg-core';

/**
 * Drizzle schema for files table.
 * Mirrors the File domain model.
 */
export const files = pgTable('files', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  fileType: text('file_type').notNull(),
  filePath: text('file_path').notNull(),
  mimeType: text('mime_type').notNull(),
  size: bigint('size', { mode: 'number' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});


