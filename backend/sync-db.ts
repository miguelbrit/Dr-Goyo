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

    const columnsToAdd = [
      { table: 'Profile', col: 'email', type: 'TEXT' },
      { table: 'Profile', col: 'name', type: 'TEXT' },
      { table: 'Profile', col: 'surname', type: 'TEXT' },
      { table: 'Profile', col: 'type', type: 'TEXT' },
      { table: 'Profile', col: 'image_url', type: 'TEXT' },
      { table: 'Profile', col: 'created_at', type: 'TIMESTAMP' },
      { table: 'Profile', col: 'updated_at', type: 'TIMESTAMP' },
      
      { table: 'Doctor', col: 'status', type: 'TEXT' },
      { table: 'Doctor', col: 'address', type: 'TEXT' },
      { table: 'Doctor', col: 'city', type: 'TEXT' },
      
      { table: 'Pharmacy', col: 'business_name', type: 'TEXT' },
      { table: 'Pharmacy', col: 'address', type: 'TEXT' },
      
      { table: 'Laboratory', col: 'business_name', type: 'TEXT' },
      { table: 'Laboratory', col: 'address', type: 'TEXT' }
    ];

    for (const item of columnsToAdd) {
      try {
        await client.query(`ALTER TABLE "${item.table}" ADD COLUMN "${item.col}" ${item.type}`);
        console.log(`Added ${item.col} to ${item.table}`);
      } catch (e) {
        // console.log(`${item.col} already exists or error: ${e.message}`);
      }
    }

    console.log("Aggressive Sync complete");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
  }
}

sync();
