import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase (compatible with Vite & Create React App)
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 
                    (typeof process !== 'undefined' ? process.env?.REACT_APP_SUPABASE_URL : '') || '';

const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 
                        (typeof process !== 'undefined' ? process.env?.REACT_APP_SUPABASE_ANON_KEY : '') || '';

// Determine if valid Supabase credentials are configured
export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    !supabaseUrl.includes('your-project-id')
  );
};

// Create Supabase Client instance (fallback to mock client if not configured)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const getSupabaseConfig = () => ({
  isConfigured: isSupabaseConfigured(),
  url: supabaseUrl || 'Not configured (using local reactive storage mode)',
});

export default supabase;
