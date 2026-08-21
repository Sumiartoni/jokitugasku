import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_SUPABASE_URL = 'https://harmnrijndrnzmxvwjbj.supabase.co';
const DEFAULT_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhcm1ucmlqbmRybnpteHZ3amJqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzIxNjYwNCwiZXhwIjoyMTAyNzkyNjA0fQ.6-cxj9owyJSg04zCMR7jAnbUKHGG5HSSTo5qhVlSlrI';

const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || DEFAULT_SERVICE_ROLE_KEY;

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
