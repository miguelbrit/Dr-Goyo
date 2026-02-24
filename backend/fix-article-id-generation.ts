import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    // Enable the extension and set the default value for the id column
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await client.query('ALTER TABLE "Article" ALTER COLUMN id SET DEFAULT gen_random_uuid()');
    console.log("Article ID default set to gen_random_uuid() successfully.");
  } catch (e) {
    console.error("Error updating ID default:", e.message);
  } finally {
    await client.end();
  }
}
run();
