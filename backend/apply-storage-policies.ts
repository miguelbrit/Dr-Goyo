import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    // Enable RLS for storage.objects if not enabled
    await client.query('ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY');

    // Create policies for master-content bucket
    // 1. SELECT (Read)
    await client.query('DROP POLICY IF EXISTS "Public Access" ON storage.objects');
    await client.query(`
      CREATE POLICY "Public Access" ON storage.objects 
      FOR SELECT 
      USING ( bucket_id = 'master-content' )
    `);

    // 2. INSERT (Upload)
    await client.query('DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects');
    await client.query(`
      CREATE POLICY "Authenticated Upload" ON storage.objects 
      FOR INSERT 
      WITH CHECK ( bucket_id = 'master-content' AND auth.role() = 'authenticated' )
    `);

    // 3. UPDATE/DELETE (Optional but good for management)
    await client.query('DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects');
    await client.query(`
      CREATE POLICY "Authenticated Update" ON storage.objects 
      FOR UPDATE
      USING ( bucket_id = 'master-content' AND auth.role() = 'authenticated' )
    `);
    
    console.log("Storage policies for master-content applied successfully.");
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
