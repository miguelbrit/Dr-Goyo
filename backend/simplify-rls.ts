import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    // 1. Grant usage on enum
    await client.query('GRANT USAGE ON TYPE "UserType" TO anon, authenticated, service_role');
    
    // 2. Simplify Profile policy to the absolute minimum for testing
    await client.query('DROP POLICY IF EXISTS "Admin and Owners Select Profile" ON "Profile"');
    await client.query('DROP POLICY IF EXISTS "Allow authenticated to read own profile" ON "Profile"');
    
    // This policy is extremely permissive for authenticated users to avoid any lookup issues
    await client.query(`
      CREATE POLICY "Permissive Authenticated Select" ON "Profile"
      FOR SELECT
      TO authenticated
      USING (true)
    `);
    
    console.log("RLS Simplified for Profile table.");
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
