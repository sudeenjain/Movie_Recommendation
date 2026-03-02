import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pyybqmtthjhrkenoqwoq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5eWJxbXR0aGpocmtlbm9xd29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzOTE0MjAsImV4cCI6MjA4Njk2NzQyMH0.sue9xwmKVQsalLZeqLL-3NdVn52Cb5QAd7o4MDhQfnk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);