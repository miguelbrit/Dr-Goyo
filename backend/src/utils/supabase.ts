import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * BACKEND ARCHITECT DIAGNOSIS:
 * In Vercel (Node.js environment), variables are read from process.env.
 * Unlike the frontend, these do NOT require a prefix, but they must be
 * exactly as defined in Vercel project settings.
 */

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[CRITICAL] Supabase Configuration Error:');
  if (!supabaseUrl) console.error('  - SUPABASE_URL is missing');
  if (!supabaseServiceKey) console.error('  - SUPABASE_SERVICE_ROLE_KEY is missing');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
