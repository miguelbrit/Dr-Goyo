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

    // Fix Profile table - Prisma uses @map("updated_at") which means the column name MUST be "updated_at"
    const profileColumns = [
      { name: 'email', type: 'TEXT' },
      { name: 'name', type: 'TEXT' },
      { name: 'surname', type: 'TEXT' },
      { name: 'type', type: 'TEXT' },
      { name: 'image_url', type: 'TEXT' },
      { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' }
    ];

    for (const col of profileColumns) {
      try {
        await client.query(`ALTER TABLE "Profile" ADD COLUMN "${col.name}" ${col.type}`);
        console.log(`Profile: Added ${col.name}`);
      } catch (e) {}
    }

    // Fix Patient table
    const patientColumns = [
      { name: 'profile_id', type: 'TEXT' },
      { name: 'phone', type: 'TEXT' },
      { name: 'birthDate', type: 'TIMESTAMP' },
      { name: 'gender', type: 'TEXT' },
      { name: 'weight', type: 'FLOAT' },
      { name: 'height', type: 'FLOAT' },
      { name: 'address', type: 'TEXT' },
      { name: 'city', type: 'TEXT' }
    ];

    for (const col of patientColumns) {
      try {
        await client.query(`ALTER TABLE "Patient" ADD COLUMN "${col.name}" ${col.type}`);
        console.log(`Patient: Added ${col.name}`);
      } catch (e) {}
    }

    console.log("Sync unblocked");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

sync();
