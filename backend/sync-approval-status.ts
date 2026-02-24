import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function sync() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return;

  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to DB");

    const tables = ['Doctor', 'Pharmacy', 'Laboratory'];
    for (const table of tables) {
      const res = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = '${table}' AND column_name = 'status'
      `);
      
      if (res.rowCount === 0) {
        console.log(`Adding status column to ${table}...`);
        await client.query(`ALTER TABLE "${table}" ADD COLUMN "status" TEXT DEFAULT 'PENDING'`);
      } else {
        console.log(`Status column already exists in ${table}`);
      }
    }

    console.log("Database status columns synced.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

sync();
