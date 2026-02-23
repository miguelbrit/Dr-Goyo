
import { supabase } from './src/utils/supabase.js';

async function resetAndLogin() {
  const email = "test_patient_17718007992847@example.com";
  const newPassword = "NewPassword123!";

  // 1. Get user ID
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  const user = users?.users.find(u => u.email === email);
  
  if (!user) {
    console.error("User not found");
    return;
  }

  console.log(`Updating password for ${email} (${user.id})...`);

  // 2. Update password
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    { password: newPassword }
  );

  if (updateError) {
    console.error("Update error:", updateError);
    return;
  }

  console.log("Password updated. Attempting login...");

  // 3. Attempt login
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password: newPassword
  });

  if (loginError) {
    console.error("Login error:", loginError);
  } else {
    console.log("Login SUCCESS!");
    console.log("Token:", loginData.session?.access_token.substring(0, 20) + "...");
  }
}

resetAndLogin();
