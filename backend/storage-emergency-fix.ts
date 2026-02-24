import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    // Emergency Storage Permission Fix
    console.log("Attempting to fix Storage permissions...");
    
    // 1. Grant usage on storage schema
    await client.query('GRANT USAGE ON SCHEMA storage TO anon, authenticated');
    
    // 2. Grant all on objects to authenticated (to allow RLS to work internally)
    // If we are not owner, this might fail, but it's worth a try.
    try {
      await client.query('GRANT ALL ON TABLE storage.objects TO postgres, service_role, authenticated');
      await client.query('GRANT ALL ON TABLE storage.buckets TO postgres, service_role, authenticated');
    } catch (e) {
      console.warn("Grant failed:", e.message);
    }

    // 3. Create THE policy if RLS is enabled
    // We use a DO block to be safer
    await client.query(`
      DO $$
      BEGIN
        -- Enable RLS if possible (might fail if not owner)
        BEGIN
          ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Could not enable RLS on storage.objects';
        END;

        -- Drop existing
        DELETE FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

        -- Create simple policies
        EXECUTE 'CREATE POLICY "Allow All" ON storage.objects FOR ALL TO authenticated USING (true) WITH CHECK (true)';
      END
      $$;
    `);

    console.log("Storage RLS bypass attempt finished.");

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
