import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pyybqmtthjhrkenoqwoq.supabase.co";

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1cnRodmRvd3BraHpnZWt4dW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzQzOTQsImV4cCI6MjA4ODA1MDM5NH0.ArHjONAY3poz9sS4uyyniVGBf5lFoBNdfYUbBy5D6v8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);