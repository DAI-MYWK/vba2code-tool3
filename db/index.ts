import { sql } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not set');
}

export const db = drizzle(sql(process.env.POSTGRES_URL));
export * from './schema';
