import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    // Insert profile for miguelbrit@gmail.com
    await client.query(`
      INSERT INTO "Profile" (id, email, name, type)
      VALUES ('ea3373ba-02a7-4eea-920e-385732552961', 'miguelbrit@gmail.com', 'Miguel Brito', 'Admin'::"UserType")
      ON CONFLICT (id) DO UPDATE SET type = 'Admin'::"UserType"
    `);
    console.log("Profile created/updated for Miguel Brito.");
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
