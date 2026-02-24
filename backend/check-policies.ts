import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query(`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
      FROM pg_policies 
      WHERE tablename = 'Profile'
    `);
    console.log(JSON.stringify(res.rows));
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
