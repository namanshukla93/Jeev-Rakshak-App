import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Singleton pattern to avoid multiple GoTrueClient instances
let supabaseInstance = null;

function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;
  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    }
  });
  return supabaseInstance;
}

export const supabase = getSupabaseClient();
