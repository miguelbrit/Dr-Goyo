import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function fix() {
  const connectionString = process.env.DIRECT_URL;
  if (!connectionString) {
    console.error("DIRECT_URL not found");
    return;
  }

  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to DB via DIRECT_URL");
    
    // Check and add columns for User table
    const columnsToSync = [
      { name: 'surname', type: 'TEXT' },
      { name: 'imageUrl', type: 'TEXT' },
      { name: 'type', type: '"UserType" DEFAULT \'Paciente\'' },
    ];

    for (const col of columnsToSync) {
      const checkRes = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = '${col.name}'
      `);
      
      if (checkRes.rowCount === 0) {
        console.log(`Adding column '${col.name}' to 'User' table...`);
        try {
          await client.query(`ALTER TABLE "User" ADD COLUMN "${col.name}" ${col.type}`);
          console.log(`Column '${col.name}' added successfully`);
        } catch (err: any) {
          console.error(`Error adding column '${col.name}':`, err.message);
        }
      } else {
        console.log(`Column '${col.name}' already exists`);
      }
    }

  } catch (error) {
    console.error("Error fixing DB:", error);
  } finally {
    await client.end();
  }
}

fix();
