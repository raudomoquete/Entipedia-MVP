import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

// Construir DATABASE_URL desde variables individuales si no existe
function getDatabaseUrl(): string {
  // Si DATABASE_URL está configurada, usarla
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Construir desde variables individuales
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_NAME || 'entipedia';
  const user = process.env.DB_USER || 'user';
  const password = process.env.DB_PASSWORD || 'password';

  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

const config: Config = {
  schema: './src/infrastructure/database/schema/*.ts',
  out: './src/infrastructure/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: getDatabaseUrl(),
  },
};

export default config;

