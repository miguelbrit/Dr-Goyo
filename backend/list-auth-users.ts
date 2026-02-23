
import { supabase } from './src/utils/supabase.js';

async function listUsers() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Error listing users:", error);
    return;
  }
  console.log("Users in Supabase Auth:");
  console.log(data.users.map(u => u.email));
}

listUsers();
