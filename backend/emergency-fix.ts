import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function fix() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return;

  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    console.log("Adding health_status column explicitly...");
    try {
      await client.query(`ALTER TABLE "Profile" ADD COLUMN "health_status" TEXT`);
      console.log("Column health_status added");
    } catch (e) {
      console.log("Column health_status already exists or cannot be added");
    }

    console.log("Adding updatedAt to Patient if missing...");
    try {
      await client.query(`ALTER TABLE "Patient" ADD COLUMN "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);
      console.log("Column updated_at added to Patient");
    } catch (e) {}

  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

fix();
