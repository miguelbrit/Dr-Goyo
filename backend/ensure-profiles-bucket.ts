import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Checking 'profiles' bucket...");
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error("Error listing buckets:", listError);
    return;
  }

  const exists = buckets.find(b => b.id === 'profiles');
  
  if (exists) {
    console.log("Bucket 'profiles' already exists.");
  } else {
    const { data, error } = await supabase.storage.createBucket('profiles', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
    });

    if (error) {
      console.error("Error creating bucket:", error);
    } else {
      console.log("Bucket 'profiles' created successfully.");
    }
  }

  // Set up public access policy if not public
  console.log("Bucket setup finished.");
}

run();
