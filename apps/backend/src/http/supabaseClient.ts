import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dybhsezyznzrvmtlpsyg.supabase.co'; 
const supabaseAnonKey = process.env.SUPABASE_ACCESS_TOKEN;

if (!supabaseAnonKey) {
  throw new Error('SUPABASE_ACCESS_TOKEN is not defined. Please set it in your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
