import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query(`
      SELECT routine_definition 
      FROM information_schema.routines 
      WHERE routine_name = 'is_admin'
    `);
    console.log("is_admin definition:", res.rows[0]?.routine_definition);
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
