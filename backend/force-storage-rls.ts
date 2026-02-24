import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    // Attempting to set storage policies via raw SQL
    // If this fails, the user will need to do it in the UI
    try {
      await client.query(`
        DO $$
        BEGIN
          -- 1. Enable RLS
          ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
          
          -- 2. Drop existing
          DROP POLICY IF EXISTS "Public Select Master Content" ON storage.objects;
          DROP POLICY IF EXISTS "Authenticated Insert Master Content" ON storage.objects;
          
          -- 3. Create Select Policy
          CREATE POLICY "Public Select Master Content" ON storage.objects 
          FOR SELECT TO public USING ( bucket_id = 'master-content' );
          
          -- 4. Create Insert Policy
          CREATE POLICY "Authenticated Insert Master Content" ON storage.objects 
          FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'master-content' );
        END
        $$;
      `);
      console.log("SQL Storage policies applied.");
    } catch (sqlErr) {
      console.error("SQL Error applying policies:", sqlErr);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
