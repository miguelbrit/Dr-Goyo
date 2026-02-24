import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    // 1. Add missing columns to Article table
    console.log("Adding columns to Article...");
    await client.query(`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS subtitle TEXT`);
    await client.query(`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS image TEXT`);
    await client.query(`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS category TEXT`);
    await client.query(`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0`);
    await client.query(`ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft'`);

    // 2. Recreate is_admin as SECURITY DEFINER
    await client.query(`
      CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
      RETURNS boolean
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM public."Profile"
          WHERE id = user_id::text AND type = 'Admin'::"UserType"
        );
      END;
      $$;
    `);

    // 3. Update core RLS
    const tables = ['Patient', 'Doctor', 'Pharmacy', 'Laboratory', 'Profile', 'Article'];
    for (const table of tables) {
      await client.query(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY`);
      await client.query(`DROP POLICY IF EXISTS "Admin Select All" ON "${table}"`);
      await client.query(`
        CREATE POLICY "Admin Select All" ON "${table}"
        FOR SELECT
        TO authenticated
        USING (is_admin(auth.uid()))
      `);
    }

    // 4. Article specific policies
    await client.query('DROP POLICY IF EXISTS "Admin All Articles" ON "Article"');
    await client.query('CREATE POLICY "Admin All Articles" ON "Article" FOR ALL TO authenticated USING (is_admin(auth.uid()))');
    await client.query('DROP POLICY IF EXISTS "Public Read Articles" ON "Article"');
    await client.query('CREATE POLICY "Public Read Articles" ON "Article" FOR SELECT TO public USING (status = \'published\')');

    console.log("Database schema and policies updated.");

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
