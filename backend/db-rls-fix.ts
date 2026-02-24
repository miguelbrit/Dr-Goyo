import 'dotenv/config';
import pkg from 'pg';
const { Client } = pkg;

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log("Connected to database.");

    // 1. Add 'Admin' to UserType enum
    await client.query("ALTER TYPE \"UserType\" ADD VALUE IF NOT EXISTS 'Admin'");
    console.log("Added 'Admin' to UserType enum.");

    // 2. Create is_admin function if not exists
    // This function checks if the current user (from JWT) is an Admin in the Profile table
    await client.query(`
      CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
      RETURNS boolean AS $$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM public."Profile"
          WHERE id = user_id::text AND type = 'Admin'::"UserType"
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
    console.log("Created is_admin function.");

    // 3. Enable RLS and setup policies for sensitive tables
    const tables = ['Patient', 'Doctor', 'Pharmacy', 'Laboratory'];
    for (const table of tables) {
      // Enable RLS
      await client.query(`ALTER TABLE public."${table}" ENABLE ROW LEVEL SECURITY`);
      
      // Drop existing policies if they might conflict (optional, but safer for re-runs)
      await client.query(`DROP POLICY IF EXISTS "Admin and Owners Select" ON public."${table}"`);

      // Add policy: Allow SELECT if user is owner OR user is admin
      // Note: In Supabase, the user_id in auth.uid() matches profile_id in our tables (except Profile where it's id)
      // Our tables use 'profile_id' for some, and 'id' for others.
      // Profile: id (text) matches auth.uid()
      // Doctor/Pharmacy/Lab: profile_id (text) matches auth.uid()
      
      let profileCol = table === 'Profile' ? 'id' : 'profile_id';
      
      await client.query(`
        CREATE POLICY "Admin and Owners Select" ON public."${table}"
        FOR SELECT
        USING (
          (auth.uid())::text = "${profileCol}"
          OR 
          public.is_admin(auth.uid())
        )
      `);
      console.log(`Setup RLS Policy for ${table}.`);
    }

    // Special case for Profile table
    await client.query(`ALTER TABLE public."Profile" ENABLE ROW LEVEL SECURITY`);
    await client.query(`DROP POLICY IF EXISTS "Admin and Owners Select Profile" ON public."Profile"`);
    await client.query(`
      CREATE POLICY "Admin and Owners Select Profile" ON public."Profile"
      FOR SELECT
      USING (
        (auth.uid())::text = "id"
        OR 
        public.is_admin(auth.uid())
      )
    `);
    console.log("Setup RLS Policy for Profile.");

    console.log("Migration completed successfully.");
  } catch (e) {
    console.error("Migration error:", e);
  } finally {
    await client.end();
  }
}
run();
