
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // You might need to generate this type

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
