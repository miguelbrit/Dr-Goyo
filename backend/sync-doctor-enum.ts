import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function sync() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return;

  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to DB");

    // 1. Create Enum if missing
    try {
      await client.query(`CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED')`);
      console.log("Enum VerificationStatus created");
    } catch (e) {
      console.log("Enum VerificationStatus already exists or error skip");
    }

    // 2. Fix Doctor table - convert status to Enum if it was text, or just ensure it exists
    try {
      // If it exists as text, we might need to cast it
      await client.query(`ALTER TABLE "Doctor" ALTER COLUMN status TYPE "VerificationStatus" USING status::"VerificationStatus"`);
      console.log("Converted status column to Enum");
    } catch (e) {
      try {
        await client.query(`ALTER TABLE "Doctor" ADD COLUMN status "VerificationStatus" DEFAULT 'PENDING'`);
        console.log("Added status column as Enum");
      } catch (e2) {}
    }

    console.log("Sync for Doctor Enums complete");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

sync();
