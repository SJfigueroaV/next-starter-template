import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Si hay un código OAuth en la raíz, redirigir al callback correcto
  if (pathname === '/' && request.nextUrl.searchParams.get('code')) {
    const code = request.nextUrl.searchParams.get('code');
    console.log('🔄 Middleware: Redirigiendo código OAuth de / a /auth/callback');
    const redirectUrl = new URL('/auth/callback', request.url);
    redirectUrl.searchParams.set('code', code!);
    // Preservar otros query params
    request.nextUrl.searchParams.forEach((value, key) => {
      if (key !== 'code') {
        redirectUrl.searchParams.set(key, value);
      }
    });
    return NextResponse.redirect(redirectUrl);
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  // Excluir rutas estáticas y de API que no necesitan autenticación
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANTE: Actualizar las cookies de sesión
  // Supabase SSR necesita que el middleware actualice las cookies para que se propaguen
  // Usamos getSession() que actualiza las cookies automáticamente sin hacer refresh
  // El interceptor customFetch maneja los errores 429 silenciosamente
  try {
    // getSession() lee la sesión de las cookies y actualiza las cookies si es necesario
    // Esto es necesario para que los Server Components puedan leer la sesión
    const { data: { session } } = await supabase.auth.getSession();
    
    // Si hay una sesión, las cookies deberían estar presentes y actualizadas
    if (session && process.env.NODE_ENV === 'development') {
      const hasAuthCookies = request.cookies.getAll().some(c => 
        c.name.includes('supabase') || c.name.includes('sb-') || c.name.includes('auth-token')
      );
      
      if (!hasAuthCookies) {
        console.warn('⚠️ Middleware: Sesión encontrada pero no hay cookies de autenticación en la request');
        console.warn('⚠️ Esto puede causar que el servidor no reconozca al usuario autenticado');
        console.warn('⚠️ Verifica que las cookies se estén estableciendo correctamente en el cliente');
      } else {
        console.log('✅ Middleware: Sesión encontrada y cookies presentes');
        console.log('✅ Middleware: Usuario:', session.user.email);
      }
    } else if (!session && process.env.NODE_ENV === 'development') {
      // Verificar si hay cookies pero no hay sesión (puede indicar un problema)
      const hasAuthCookies = request.cookies.getAll().some(c => 
        c.name.includes('supabase') || c.name.includes('sb-') || c.name.includes('auth-token')
      );
      if (hasAuthCookies) {
        console.warn('⚠️ Middleware: Cookies presentes pero no hay sesión');
        console.warn('⚠️ Esto puede indicar que las cookies están corruptas o expiradas');
      }
    }
  } catch (error) {
    // Ignorar errores silenciosamente para evitar que rompan la aplicación
    // El interceptor customFetch maneja los errores 429
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Middleware: Error al obtener sesión (ignorado):', error);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

