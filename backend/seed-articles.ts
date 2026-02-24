import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    
    const res = await client.query('SELECT id FROM "Profile" WHERE type = \'Admin\'::"UserType" LIMIT 1');
    const adminId = res.rows[0]?.id;
    
    if (adminId) {
      await client.query(`
        INSERT INTO "Article" (id, title, content, type, "authorId", status, category, subtitle)
        VALUES (
          gen_random_uuid(), 
          'Bienvenido al nuevo Dashboard Maestro', 
          'Este es un artículo real guardado en la base de datos.', 
          'Admin'::"UserType", 
          $1, 
          'published', 
          'General',
          'Guía de inicio para administradores'
        )
        ON CONFLICT DO NOTHING
      `, [adminId]);
      console.log("Mock article inserted for testing.");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
