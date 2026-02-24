import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    // 1. Recreate is_admin as SECURITY DEFINER
    await client.query(`
      CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
      RETURNS boolean
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM "Profile"
          WHERE id = user_id::text AND type = 'Admin'::"UserType"
        );
      END;
      $$;
    `);
    console.log("is_admin recreated as SECURITY DEFINER.");

    // 2. Grant permissions to execute the function
    await client.query('GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon, authenticated, service_role');

    // 3. Ensure RLS is enabled on core tables
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
      
      // Also allow users to see their own records
      await client.query(`DROP POLICY IF EXISTS "Owner Select" ON "${table}"`);
      if (table === 'Profile') {
        await client.query(`CREATE POLICY "Owner Select" ON "Profile" FOR SELECT TO authenticated USING (auth.uid()::text = id)`);
      } else if (table !== 'Article') {
        await client.query(`CREATE POLICY "Owner Select" ON "${table}" FOR SELECT TO authenticated USING (auth.uid()::text = profile_id)`);
      }
    }
    
    // 4. Special policy for Article: Everyone can read published, Admins can do everything
    await client.query('DROP POLICY IF EXISTS "Public Read Articles" ON "Article"');
    await client.query('CREATE POLICY "Public Read Articles" ON "Article" FOR SELECT USING (status = \'published\')');
    await client.query('DROP POLICY IF EXISTS "Admin All Articles" ON "Article"');
    await client.query('CREATE POLICY "Admin All Articles" ON "Article" ALL TO authenticated USING (is_admin(auth.uid()))');

    console.log("Database RLS and functions updated for Admin access.");

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
