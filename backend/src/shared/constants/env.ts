import * as dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
  DB_NAME: process.env.DB_NAME || 'entipedia',
  DB_USER: process.env.DB_USER || 'user',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3001',
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  RATE_LIMIT_WINDOW_MS: parseInt(
    process.env.RATE_LIMIT_WINDOW_MS || '900000',
    10
  ),
  RATE_LIMIT_MAX_REQUESTS: parseInt(
    process.env.RATE_LIMIT_MAX_REQUESTS || '100',
    10
  ),
} as const;

