import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * PRISMA ARCHITECT DIAGNOSIS:
 * Robust database initialization for Vercel (Serverless).
 * Handling SSL for Supabase connection.
 */

const connectionString = process.env.DATABASE_URL?.trim();

if (!connectionString) {
  console.error("FATAL: DATABASE_URL is not defined in environment variables.");
}

// Configuration for pg Pool with SSL support (critical for Vercel -> Supabase)
const poolConfig = {
  connectionString: connectionString || 'postgresql://invalid:invalid@localhost:5432/invalid',
  ssl: connectionString?.includes('localhost') ? false : { 
    rejectUnauthorized: false // Required for many cloud databases like Supabase
  },
  max: 1 // In serverless, we generally want small pools per invocation
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('[Postgres Pool Error]:', err.message);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ 
  adapter,
  log: ['info', 'warn', 'error']
});

export default prisma;
