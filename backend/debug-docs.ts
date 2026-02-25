import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query(`
      SELECT d.id, d.status, d.specialty, p.name, p.surname
      FROM "Doctor" d
      JOIN "Profile" p ON d.profile_id = p.id
    `);
    console.log('Doctors Detail:', JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
