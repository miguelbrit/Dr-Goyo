import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * PRISMA ARCHITECT DIAGNOSIS:
 * If DATABASE_URL is missing, we must catch it early to avoid process crashes.
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("FATAL: DATABASE_URL is not defined.");
}

// Fallback to avoid immediate crash on initialization, although queries will fail
const pool = new Pool(connectionString ? { connectionString } : { connectionString: 'postgresql://invalid:invalid@localhost:5432/invalid' });

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ 
  adapter,
  log: ['query', 'info', 'warn', 'error']
});

export default prisma;
