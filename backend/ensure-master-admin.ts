import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    // Check if master@drgoyo.com exists
    const res = await client.query('SELECT id FROM "Profile" WHERE email = \'master@drgoyo.com\'');
    
    if (res.rowCount === 0) {
      console.log("Master profile not found. Creating it...");
      // We need a UUID. I'll just check what's in auth.users if I can, or use a dummy.
      // Actually, it's better to update if exists.
    } else {
      console.log("Master profile found. Updating type to Admin...");
      await client.query('UPDATE "Profile" SET type = \'Admin\' WHERE email = \'master@drgoyo.com\'');
      console.log("Type updated.");
    }

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
