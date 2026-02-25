import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query(`SELECT id, status FROM "Doctor" LIMIT 10`);
    console.log('Doctor statuses:', JSON.stringify(res.rows, null, 2));
    
    const enumRes = await client.query(`
      SELECT e.enumlabel
      FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'VerificationStatus'
    `);
    console.log('Enum values:', JSON.stringify(enumRes.rows, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
