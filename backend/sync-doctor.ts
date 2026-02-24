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

    // Fix Doctor table
    const doctorColumns = [
      { name: 'profile_id', type: 'TEXT' },
      { name: 'specialty', type: 'TEXT' },
      { name: 'license', type: 'TEXT' },
      { name: 'bio', type: 'TEXT' },
      { name: 'experienceYears', type: 'INTEGER DEFAULT 0' },
      { name: 'consultationPrice', type: 'FLOAT DEFAULT 0' },
      { name: 'insuranceAffiliations', type: 'TEXT' },
      { name: 'city', type: 'TEXT' },
      { name: 'address', type: 'TEXT' },
      { name: 'status', type: "TEXT DEFAULT 'PENDING'" },
      { name: 'identity_doc_url', type: 'TEXT' },
      { name: 'professional_title_url', type: 'TEXT' }
    ];

    for (const col of doctorColumns) {
      try {
        await client.query(`ALTER TABLE "Doctor" ADD COLUMN "${col.name}" ${col.type}`);
        console.log(`Doctor: Added ${col.name}`);
      } catch (e) {}
    }

    console.log("Sync for Doctor complete");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

sync();
