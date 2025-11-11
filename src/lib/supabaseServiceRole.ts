import { createClient } from '@supabase/supabase-js';

// Cliente de Supabase con Service Role Key para operaciones administrativas
// ⚠️ SOLO usar en el servidor, NUNCA exponer en el cliente
export function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
  }

  if (!supabaseServiceRoleKey) {
    throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

