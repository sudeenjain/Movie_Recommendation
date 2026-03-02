import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pyybqmtthjhrkenoqwoq.supabase.co";

const supabaseAnonKey = "YOUR_ANON_PUBLIC_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);