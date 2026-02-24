import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function check() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return;

  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    const tables = ['Profile', 'Patient', 'Doctor', 'Pharmacy', 'Laboratory'];
    for (const table of tables) {
      console.log(`--- ${table} Columns ---`);
      const res = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = '${table}'
      `);
      console.table(res.rows);
    }

  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

check();
