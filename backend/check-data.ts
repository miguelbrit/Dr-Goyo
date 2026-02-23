import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

async function checkData() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL
  });
  try {
    await client.connect();
    
    const tables = ['profiles', 'Profile'];
    for (const table of tables) {
      const res = await client.query(`SELECT count(*) FROM "${table}"`);
      console.log(`Table ${table} count: ${res.rows[0].count}`);
      if (parseInt(res.rows[0].count) > 0) {
        const data = await client.query(`SELECT * FROM "${table}" LIMIT 1`);
        console.log(`Sample data from ${table}:`, data.rows[0]);
      }
    }
  } catch (err) {
    console.error("Error checking table:", err.message);
  } finally {
    await client.end();
  }
}

checkData();
