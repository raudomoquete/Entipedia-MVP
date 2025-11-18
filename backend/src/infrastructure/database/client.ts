import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../../shared/constants/env';
import { logger } from '../logger/logger';

// Construir DATABASE_URL desde variables individuales si no existe
function getDatabaseUrl(): string {
  // Si DATABASE_URL está configurada, usarla
  if (env.DATABASE_URL) {
    return env.DATABASE_URL;
  }

  // Construir desde variables individuales
  const host = env.DB_HOST;
  const port = env.DB_PORT;
  const database = env.DB_NAME;
  const user = env.DB_USER;
  const password = env.DB_PASSWORD;

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

const pool = new Pool({
  connectionString: getDatabaseUrl(),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected database pool error');
});

export const db = drizzle(pool);

export async function closeDatabase(): Promise<void> {
  await pool.end();
  logger.info('Database connection pool closed');
}

