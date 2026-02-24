import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    console.log("Fixing public schema permissions for all roles...");

    // 1. Grant usage on schema public to everyone
    await client.query('GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role');
    
    // 2. Grant ALL privileges on all tables in public schema to roles
    await client.query('GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role');
    
    // 3. Grant ALL privileges on all sequences in public schema (important for IDs)
    await client.query('GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role');
    
    // 4. Ensure future tables also have these permissions
    await client.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role');
    await client.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role');

    // 5. Special check for extensions schema if exists
    try {
        await client.query('GRANT USAGE ON SCHEMA extensions TO anon, authenticated, service_role');
    } catch(e) {}

    console.log("Permissions granted. The 'permission denied for schema public' error should be resolved.");

  } catch (e) {
    console.error("Critical error fixing permissions:", e);
  } finally {
    await client.end();
  }
}
run();
