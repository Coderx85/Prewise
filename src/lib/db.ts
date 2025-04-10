import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

config({
  path: '.env',
});

const url = process.env.DATABASE_URL as string;

export const db = drizzle(url);
