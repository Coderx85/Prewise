import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';

config({
  path: '.env',
});

export default {
  schema: 'src/lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
