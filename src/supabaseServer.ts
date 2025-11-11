import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  // Log para depuración (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    const allCookies = cookieStore.getAll();
    const supabaseCookies = allCookies.filter(c => 
      c.name.includes('supabase') || 
      c.name.includes('sb-') ||
      c.name.includes('auth-token')
    );
    console.log('🍪 Cookies disponibles:', supabaseCookies.length, 'cookies de Supabase');
    if (supabaseCookies.length === 0) {
      console.warn('⚠️ No se encontraron cookies de Supabase - esto puede causar problemas de autenticación');
      console.log('📋 Todas las cookies recibidas:', allCookies.map(c => c.name).join(', ') || 'ninguna');
    } else {
      supabaseCookies.forEach(c => {
        console.log('  -', c.name, ':', c.value.substring(0, 20) + '...');
      });
    }
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            if (process.env.NODE_ENV === 'development') {
              console.log('⚠️ No se pudieron establecer cookies en Server Component (normal si hay middleware)');
            }
          }
        },
      },
    }
  );
}

