import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query(`
      SELECT 
        (SELECT count(*) FROM "Patient") as patients,
        (SELECT count(*) FROM "Doctor") as doctors,
        (SELECT count(*) FROM "Pharmacy") as pharmacies,
        (SELECT count(*) FROM "Laboratory") as labs
    `);
    console.log("Real DB Counts:", JSON.stringify(res.rows[0]));
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
