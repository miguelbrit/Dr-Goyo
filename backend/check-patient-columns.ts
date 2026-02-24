import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Patient'
    `);
    console.log("Patient columns:", JSON.stringify(res.rows));
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
