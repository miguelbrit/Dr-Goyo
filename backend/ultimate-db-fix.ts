import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function ultimateFix() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return;

  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to DB");

    // Fix Pharmacy
    try {
      await client.query(`ALTER TABLE "Pharmacy" RENAME COLUMN "name" TO "business_name"`);
      console.log("Pharmacy: Renamed name to business_name");
    } catch (e) {}

    // Fix Laboratory
    try {
      await client.query(`ALTER TABLE "Laboratory" RENAME COLUMN "name" TO "business_name"`);
      console.log("Laboratory: Renamed name to business_name");
    } catch (e) {}

    // Fix Image URLs to snake_case as per schema mapping @map("image_url")
    const tables = ["Doctor", "Pharmacy", "Laboratory"];
    for (const table of tables) {
      try {
        await client.query(`ALTER TABLE "${table}" RENAME COLUMN "imageUrl" TO "image_url"`);
        console.log(`${table}: Renamed imageUrl to image_url`);
      } catch (e) {}
    }

    // Fix Doctor specifically - remove redundant 'name' if it exists and causes issues
    // Actually, better keep it but ensure profileId is the key.

    console.log("Ultimate Sync complete");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

ultimateFix();
