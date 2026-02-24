import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    // 1. Add missing columns to Article table
    console.log("Adding columns to Article...");
    await client.query(`
      ALTER TABLE "Article" 
      ADD COLUMN IF NOT EXISTS subtitle TEXT,
      ADD COLUMN IF NOT EXISTS image TEXT,
      ADD COLUMN IF NOT EXISTS category TEXT,
      ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft'
    `);

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
          SELECT 1 FROM "Profile"
          WHERE id = user_id::text AND type = 'Admin'::"UserType"
        );
      END;
      $$;
    `);

    // 3. Grant permissions
    await client.query('GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon, authenticated, service_role');

    // 4. Update core RLS
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

    // 5. Article specific policies
    await client.query('DROP POLICY IF EXISTS "Admin All Articles" ON "Article"');
    await client.query('CREATE POLICY "Admin All Articles" ON "Article" ALL TO authenticated USING (is_admin(auth.uid()))');
    await client.query('DROP POLICY IF EXISTS "Public Read Articles" ON "Article"');
    await client.query('CREATE POLICY "Public Read Articles" ON "Article" FOR SELECT USING (status = \'published\')');

    // 6. Fix Storage RLS
    // We try to bypass the ownership issue by creating a policy directly if possible
    // or by checking if we can grant permissions.
    try {
      // Create policies for objects in master-content
      await client.query(`
        DO $$
        BEGIN
          -- We try to create policies on storage.objects. 
          -- If we are not owner, this might fail, but let's try.
          DROP POLICY IF EXISTS "Public Access" ON storage.objects;
          CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'master-content' );
          
          DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
          CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'master-content' );
          
          DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
          CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'master-content' );
        END
        $$;
      `);
      console.log("Storage policies applied via SQL.");
    } catch (e) {
      console.warn("Storage policy SQL failed (likely ownership):", e.message);
    }

    console.log("Database schema and policies updated.");

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
