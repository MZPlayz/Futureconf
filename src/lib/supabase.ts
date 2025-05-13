
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // You might need to generate this type

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl === "YOUR_SUPABASE_URL") {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL is not set or is still the placeholder value. Please update your .env file.');
  throw new Error('Missing or placeholder Supabase URL. Please check your .env file.');
}

if (!supabaseAnonKey || supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY") {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set or is still the placeholder value. Please update your .env file.');
  throw new Error('Missing or placeholder Supabase Anon Key. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

