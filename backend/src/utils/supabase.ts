import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * BACKEND ARCHITECT DIAGNOSIS:
 * Robust Supabase Client Initialization for Vercel Serverless.
 */

const getEnv = (key: string) => {
  const value = process.env[key];
  return value ? value.trim() : '';
};

const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('SUPABASE_SERVICE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[CRITICAL] Supabase Configuration Error:');
  console.error(`  - URL Detected: ${supabaseUrl ? 'YES' : 'MISSING'}`);
  console.error(`  - Service Key Detected: ${supabaseServiceKey ? 'YES' : 'MISSING'}`);
}

// Global variable to persist client across serverless invocations
let supabase: ReturnType<typeof createClient>;

try {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL or Service Key missing from environment.');
  }

  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  console.log('[Supabase] Initialized successfully in backend.');
} catch (error: any) {
  console.error('[FATAL] Failed to initialize Supabase client:', error.message);
  // We don't want to crash the whole process immediately, but we log the error.
  // The client will be undefined which will trigger errors on usage.
  supabase = null as any;
}

export { supabase };
