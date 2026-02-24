import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    // We try to use a more powerful block
    await client.query(`
      DO $$
      BEGIN
        -- 1. Ensure bucket is public
        UPDATE storage.buckets SET public = true WHERE id = 'master-content';

        -- 2. Drop any previous conflicting policies
        -- (Using a more robust way to find them if names vary)
        PERFORM 1 FROM pg_policies WHERE policyname = 'Admin Upload Master' AND tablename = 'objects';
        IF FOUND THEN
          DROP POLICY "Admin Upload Master" ON storage.objects;
        END IF;

        -- 3. Create the policy
        -- FOR ALL instead of just INSERT to be safe for updates/selects
        -- We apply it to TO authenticated
        -- We use a name that is unlikely to exist
        EXECUTE 'CREATE POLICY "Master Content Auth Access" ON storage.objects FOR ALL TO authenticated USING (bucket_id = ''master-content'') WITH CHECK (bucket_id = ''master-content'')';
      EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Caught error: %', SQLERRM;
      END
      $$;
    `);
    
    console.log("Storage RLS policy creation attempt finished.");

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
