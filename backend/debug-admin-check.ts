import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    const userId = 'ea3373ba-02a7-4eea-920e-385732552961';
    
    // 1. Direct query
    const res1 = await client.query('SELECT type FROM "Profile" WHERE id = $1', [userId]);
    console.log("Direct query result:", JSON.stringify(res1.rows));

    // 2. Check is_admin function exactly as RLS would
    const res2 = await client.query('SELECT public.is_admin($1)', [userId]);
    console.log("is_admin function result:", JSON.stringify(res2.rows));

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
