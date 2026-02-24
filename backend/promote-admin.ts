import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query('UPDATE "Profile" SET type = \'Admin\'::"UserType" WHERE email = \'miguelbrit@gmail.com\'');
    console.log(`Promoted miguelbrit@gmail.com to Admin. Rows updated: ${res.rowCount}`);
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
