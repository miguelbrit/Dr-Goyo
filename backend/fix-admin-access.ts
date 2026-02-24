import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    // Check if the profile for Miguel exists with ANY id or email
    const profs = await client.query('SELECT * FROM "Profile" WHERE email = \'miguelbrit@gmail.com\' OR id = \'ea3373ba-02a7-4eea-920e-385732552961\'');
    console.log("Current Miguel profiles found:", JSON.stringify(profs.rows));

    // Fix: Force ensure the profile has exact ID and email and type Admin
    await client.query(`
      INSERT INTO "Profile" (id, email, name, type)
      VALUES ('ea3373ba-02a7-4eea-920e-385732552961', 'miguelbrit@gmail.com', 'Miguel Brito', 'Admin'::"UserType")
      ON CONFLICT (id) 
      DO UPDATE SET email = 'miguelbrit@gmail.com', type = 'Admin'::"UserType", name = 'Miguel Brito'
    `);
    
    console.log("Migration for Miguel Brito finished.");
    
    // Also promote Yanelly just in case you want to use that one
    await client.query(`
      UPDATE "Profile" SET type = 'Admin'::"UserType" WHERE email = 'yanellyalvarez@gmail.com'
    `);
    console.log("Updated yanellyalvarez@gmail.com to Admin as well.");

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
