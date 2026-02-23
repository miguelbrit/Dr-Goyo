
import { supabase } from './src/utils/supabase.js';

async function clearUsers() {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Error listing users:", error);
    return;
  }
  
  console.log(`Found ${data.users.length} users. Deleting...`);
  
  for (const user of data.users) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error(`Error deleting user ${user.id}:`, deleteError);
    } else {
      console.log(`Deleted user ${user.id} (${user.email})`);
    }
  }
}

clearUsers();
