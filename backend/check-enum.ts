import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query("SELECT enum_range(NULL::\"UserType\")");
    console.log(res.rows[0].enum_range);
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
