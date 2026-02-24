import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    // Disable RLS temporarily to confirm if it's the issue
    await client.query('ALTER TABLE "Profile" DISABLE ROW LEVEL SECURITY');
    console.log("RLS Disabled for Profile table.");

    // Ensure all authenticated users can see everything in Profile (Extreme fallback)
    await client.query('DROP POLICY IF EXISTS "Permissive Authenticated Select" ON "Profile"');
    await client.query('CREATE POLICY "Public Read Profile" ON "Profile" FOR SELECT USING (true)');
    
    // Grant permissions to everyone (internal Supabase roles)
    await client.query('GRANT SELECT ON TABLE "Profile" TO anon, authenticated, service_role');
    
    console.log("Permissions granted and RLS policy recreated.");
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
