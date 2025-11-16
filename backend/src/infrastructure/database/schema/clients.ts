import { pgTable, uuid, text, timestamp, numeric } from 'drizzle-orm/pg-core';

/**
 * Drizzle schema for clients table.
 * Mirrors the Client domain model.
 */
export const clients = pgTable('clients', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(), // PERSON | COMPANY
  email: text('email'),
  phone: text('phone'),
  lifetimeValue: numeric('lifetime_value', { precision: 12, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});


