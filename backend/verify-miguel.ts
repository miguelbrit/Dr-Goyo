import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query('SELECT id, email, type FROM "Profile" WHERE id = \'ea3373ba-02a7-4eea-920e-385732552961\'');
    console.log(JSON.stringify(res.rows));
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
