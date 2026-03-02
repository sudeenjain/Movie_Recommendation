import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.https://pyybqmtthjhrkenoqwoq.supabase.co|| '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Please click 'Add Supabase' to connect your project.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);