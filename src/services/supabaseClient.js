import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const rawServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

const isValidUrl = (urlString) => {
  try { 
    return Boolean(new URL(urlString)); 
  } catch(e) { 
    return false; 
  }
};

const supabaseUrl = isValidUrl(rawUrl) ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = rawKey && rawKey !== 'YOUR_SUPABASE_ANON_KEY_HERE' ? rawKey : 'placeholder';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('Missing or invalid Supabase Environment Variables. Using fallback placeholder.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = rawServiceRoleKey 
  ? createClient(supabaseUrl, rawServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;
