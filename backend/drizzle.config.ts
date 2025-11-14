import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

const config: Config = {
  schema: './src/infrastructure/database/schema/*.ts',
  out: './src/infrastructure/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
};

export default config;

