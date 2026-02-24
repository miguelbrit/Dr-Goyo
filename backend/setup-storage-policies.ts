import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    // Allow authenticated users to upload to master-content
    // We check for bucket_id = 'master-content'
    
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Allow Auth Upload' AND tablename = 'objects' AND schemaname = 'storage'
        ) THEN
          INSERT INTO storage.policies (name, bucket_id, definition, op)
          VALUES ('Allow Auth Upload', 'master-content', '(auth.role() = ''authenticated'')', 'INSERT');
        END IF;
        
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE policyname = 'Allow Auth Select' AND tablename = 'objects' AND schemaname = 'storage'
        ) THEN
          INSERT INTO storage.policies (name, bucket_id, definition, op)
          VALUES ('Allow Auth Select', 'master-content', 'true', 'SELECT');
        END IF;
      END
      $$;
    `);
    
    console.log("Storage policies for master-content updated.");
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
