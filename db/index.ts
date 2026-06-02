import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

// URL database nanti bakal kita simpen dengan aman di Environment Variable (DATABASE_URL)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("⚠️ DATABASE_URL belum diset!");
}

export const db = drizzle(connectionString || "", { schema });