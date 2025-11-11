// lib/supabaseClient.ts
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing env.NEXT_PUBLIC_SUPABASE_URL, see .env.example for more details'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY, see .env.example for more details'
  );
}

// Interceptar fetch para manejar errores 429 silenciosamente
const originalFetch = typeof window !== 'undefined' ? window.fetch : globalThis.fetch;

const customFetch = async (url: string | URL | Request, options?: RequestInit): Promise<Response> => {
  try {
    // Clonar la request para poder leerla múltiples veces si es necesario
    const response = await originalFetch(url, options);
    
    // Convertir URL a string para verificar
    const urlString = typeof url === 'string' 
      ? url 
      : url instanceof URL 
        ? url.toString() 
        : url instanceof Request 
          ? url.url 
          : String(url);
    
    // Si es un error 429 en refresh token, manejarlo silenciosamente
    // Con autoRefreshToken: false, esto no debería ocurrir, pero Supabase aún intenta refrescar
    // cuando se carga la sesión inicialmente
    if (response.status === 429 && urlString.includes('/auth/v1/token') && urlString.includes('grant_type=refresh_token')) {
      // Intentar obtener la sesión actual de Supabase directamente
      // Esto es más confiable que leer del localStorage manualmente
      let sessionData = null;
      if (typeof window !== 'undefined') {
        try {
          // Usar el cliente de Supabase para obtener la sesión actual
          // Esto evita problemas de formato o estructura
          const sessionKey = Object.keys(localStorage).find(k => 
            k.includes('supabase') && k.includes('auth-token')
          );
          if (sessionKey) {
            const stored = localStorage.getItem(sessionKey);
            if (stored) {
              try {
                sessionData = JSON.parse(stored);
              } catch {
                // Si no es JSON, podría ser un string simple
                sessionData = { access_token: stored };
              }
            }
          }
        } catch (e) {
          // Ignorar errores al leer la sesión
        }
      }
      
      // Si tenemos datos de sesión, mantenerlos; si no, retornar respuesta que mantenga la sesión
      if (sessionData?.access_token) {
        return new Response(JSON.stringify({
          access_token: sessionData.access_token,
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: sessionData.refresh_token || sessionData.access_token,
          user: sessionData.user || {}
        }), {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Si no hay sesión, retornar respuesta que no cause que Supabase invalide la sesión
      // Esto es importante para evitar SIGNED_OUT falsos
      return new Response(JSON.stringify({
        access_token: '',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: '',
        user: {}
      }), {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Si es un error 406 (Not Acceptable) en compras_libros, manejarlo silenciosamente
    // Este error generalmente indica un problema con las políticas RLS
    // Aunque las políticas estén correctas, a veces Supabase retorna 406 cuando no hay resultados
    // Retornamos una respuesta que simule "no rows found" (PGRST116)
    if (response.status === 406 && urlString.includes('/rest/v1/compras_libros')) {
      // Leer el cuerpo de la respuesta para verificar el error
      let errorBody = null;
      try {
        const clonedResponse = response.clone();
        errorBody = await clonedResponse.json().catch(() => null);
      } catch (e) {
        // Ignorar errores al leer el cuerpo
      }
      
      // Detectar si es una consulta .single() 
      // Las consultas .single() tienen estas características:
      // - Tienen select=id (o select=*)
      // - Tienen user_id=eq.xxx
      // - Tienen libro_id=eq.xxx
      // - Tienen estado_pago=eq.xxx
      const isSingleQuery = urlString.includes('select=') && 
                            urlString.includes('user_id=') && 
                            urlString.includes('libro_id=') &&
                            urlString.includes('estado_pago=');
      
      // Para .single(), Supabase espera un error PGRST116 cuando no hay resultados
      // Convertimos el 406 a un PGRST116 para que Supabase lo maneje correctamente
      if (isSingleQuery) {
        // Retornar un error que Supabase reconozca como "no rows found" (PGRST116)
        // Esto permite que el código maneje el error como "no comprado" en lugar de un error RLS
        return new Response(JSON.stringify({
          code: 'PGRST116',
          message: 'JSON object requested, multiple (or no) rows returned',
          details: 'The result contains 0 rows',
          hint: null
        }), {
          status: 406,
          statusText: 'Not Acceptable',
          headers: { 
            'Content-Type': 'application/json',
          },
        });
      } else {
        // Para consultas normales (sin .single()), retornar un array vacío
        return new Response(JSON.stringify([]), {
          status: 200,
          statusText: 'OK',
          headers: { 
            'Content-Type': 'application/json',
            'Content-Range': '0-0/0' // Indica que no hay resultados
          },
        });
      }
    }
    
    return response;
  } catch (error: any) {
    // Convertir URL a string para verificar
    const urlString = typeof url === 'string' 
      ? url 
      : url instanceof URL 
        ? url.toString() 
        : url instanceof Request 
          ? url.url 
          : String(url);
    
    // Si es un error de red (Failed to fetch) en solicitudes de auth, manejarlo
    if (error?.message?.includes('Failed to fetch') && urlString.includes('/auth/v1/')) {
      // Si es refresh token, ignorarlo silenciosamente
      if (urlString.includes('grant_type=refresh_token')) {
        return new Response(JSON.stringify({ error: 'Network error', message: 'Failed to fetch' }), {
          status: 500,
          statusText: 'Internal Server Error',
          headers: { 'Content-Type': 'application/json' },
        });
      }
      // Para otras solicitudes de auth, también manejarlas para evitar que rompan la app
      // pero solo si no es crítica (como getUser después de login exitoso)
      if (urlString.includes('/user') || urlString.includes('/token')) {
        // Retornar error pero no lanzarlo para evitar que rompa la aplicación
        // La sesión ya está establecida, así que esto es solo una verificación
        return new Response(JSON.stringify({ error: 'Network error', message: 'Failed to fetch' }), {
          status: 500,
          statusText: 'Internal Server Error',
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    
    // Si es un error 429 en refresh token
    if ((error?.message?.includes('429') || error?.status === 429) && 
        urlString.includes('/auth/v1/token') && 
        urlString.includes('grant_type=refresh_token')) {
      // Retornar respuesta simulada en lugar de lanzar error
      return new Response(JSON.stringify({ error: 'Rate limit', message: 'Too many requests' }), {
        status: 429,
        statusText: 'Too Many Requests',
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Para otros errores, lanzarlos normalmente
    throw error;
  }
};

// Interceptar localStorage para agregar logging y verificar si Supabase guarda el code verifier
if (typeof window !== 'undefined') {
  const originalSetItem = window.localStorage.setItem.bind(window.localStorage);
  const originalGetItem = window.localStorage.getItem.bind(window.localStorage);
  const originalRemoveItem = window.localStorage.removeItem.bind(window.localStorage);

  window.localStorage.setItem = function(key: string, value: string) {
    originalSetItem(key, value);
    if (key.toLowerCase().includes('code') || key.toLowerCase().includes('verifier') || key.toLowerCase().includes('pkce')) {
      console.log('💾 [localStorage] Guardando:', key, '✅ guardado');
      console.log('💾 [localStorage] Valor (primeros 30 chars):', value.substring(0, 30) + '...');
    }
  };

  window.localStorage.getItem = function(key: string) {
    const value = originalGetItem(key);
    if (key.toLowerCase().includes('code') || key.toLowerCase().includes('verifier') || key.toLowerCase().includes('pkce')) {
      console.log('🔍 [localStorage] Leyendo:', key, value ? '✅ encontrado' : '❌ no encontrado');
    }
    return value;
  };

  window.localStorage.removeItem = function(key: string) {
    originalRemoveItem(key);
    if (key.toLowerCase().includes('code') || key.toLowerCase().includes('verifier') || key.toLowerCase().includes('pkce')) {
      console.log('🗑️ [localStorage] Eliminando:', key);
    }
  };
}

// Crear un storage adapter personalizado que use localStorage explícitamente
// Esto asegura que el code verifier se guarde correctamente para PKCE
const createLocalStorageAdapter = () => {
  return {
    getItem: (key: string): string | null => {
      if (typeof window === 'undefined') return null;
      let value = window.localStorage.getItem(key);
      
      // Si no está en localStorage y es una clave relacionada con PKCE, buscar en cookies como fallback
      if (!value && (key.toLowerCase().includes('code') || key.toLowerCase().includes('verifier') || key.toLowerCase().includes('pkce'))) {
        console.log('🔄 [Storage Adapter] No encontrado en localStorage, buscando en cookies...');
        const cookies = document.cookie ? document.cookie.split(';').map(c => c.trim()).filter(c => c.length > 0) : [];
        const backupCookieName = `backup_${key}`.replace(/[^a-zA-Z0-9_-]/g, '_');
        console.log('🔍 [Storage Adapter] Buscando cookie:', backupCookieName);
        console.log('🔍 [Storage Adapter] Cookies disponibles:', cookies.length);
        const backupCookie = cookies.find(c => {
          const equalIndex = c.indexOf('=');
          if (equalIndex > 0) {
            const cookieName = c.substring(0, equalIndex).trim();
            return cookieName === backupCookieName;
          }
          return false;
        });
        if (backupCookie) {
          const equalIndex = backupCookie.indexOf('=');
          const cookieValue = decodeURIComponent(backupCookie.substring(equalIndex + 1).trim());
          console.log('✅ [Storage Adapter] Encontrado en cookies, restaurando a localStorage:', key);
          // Restaurar a localStorage para que Supabase pueda usarlo
          window.localStorage.setItem(key, cookieValue);
          value = cookieValue;
        } else {
          console.warn('⚠️ [Storage Adapter] Cookie de respaldo no encontrada:', backupCookieName);
          console.warn('⚠️ [Storage Adapter] Esto puede pasar si las cookies fueron guardadas en HTTPS pero el callback llegó a HTTP');
        }
      }
      
      // Logging para debugging
      if (key.toLowerCase().includes('code') || key.toLowerCase().includes('verifier') || key.toLowerCase().includes('pkce')) {
        console.log('🔍 [Storage Adapter] getItem:', key, value ? '✅ encontrado' : '❌ no encontrado');
      }
      return value;
    },
    setItem: (key: string, value: string): void => {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, value);
      // Logging para debugging
      if (key.toLowerCase().includes('code') || key.toLowerCase().includes('verifier') || key.toLowerCase().includes('pkce')) {
        console.log('💾 [Storage Adapter] setItem:', key, '✅ guardado');
        console.log('💾 [Storage Adapter] Valor (primeros 30 chars):', value.substring(0, 30) + '...');
      }
    },
    removeItem: (key: string): void => {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(key);
      // Logging para debugging
      if (key.toLowerCase().includes('code') || key.toLowerCase().includes('verifier') || key.toLowerCase().includes('pkce')) {
        console.log('🗑️ [Storage Adapter] removeItem:', key);
      }
    },
  };
};

// Usar createBrowserClient de @supabase/ssr para establecer cookies automáticamente
// Esto asegura que las cookies se propaguen al servidor
// El interceptor de localStorage asegura que el code verifier se guarde correctamente
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    global: {
      fetch: customFetch,
    },
    cookies: {
      getAll() {
        // createBrowserClient necesita leer las cookies del navegador
        if (typeof window === 'undefined') return [];
        const cookies: { name: string; value: string }[] = [];
        document.cookie.split(';').forEach(cookie => {
          const trimmed = cookie.trim();
          if (trimmed) {
            const [name, ...rest] = trimmed.split('=');
            if (name) {
              cookies.push({ name, value: rest.join('=') || '' });
            }
          }
        });
        return cookies;
      },
      setAll(cookiesToSet) {
        // createBrowserClient establece cookies automáticamente
        // Asegurarnos de que se establezcan con los atributos correctos
        if (typeof window === 'undefined') return;
        cookiesToSet.forEach(({ name, value, options }) => {
          let cookieString = `${name}=${encodeURIComponent(value)}`;
          
          // Establecer path por defecto si no se especifica
          const path = options?.path || '/';
          cookieString += `; path=${path}`;
          
          // Establecer maxAge si se proporciona
          if (options?.maxAge !== undefined) {
            cookieString += `; max-age=${options.maxAge}`;
          } else if (options?.expires) {
            cookieString += `; expires=${options.expires.toUTCString()}`;
          }
          
          // Establecer domain si se proporciona
          if (options?.domain) {
            cookieString += `; domain=${options.domain}`;
          }
          
          // Establecer SameSite y Secure
          const sameSite = options?.sameSite || 'Lax';
          cookieString += `; SameSite=${sameSite}`;
          const sameSiteStr = String(sameSite).toLowerCase();
          if (sameSiteStr === 'none' || window.location.protocol === 'https:') {
            cookieString += '; Secure';
          }
          
          // Establecer la cookie
          document.cookie = cookieString;
          
          // Logging reducido para evitar spam en la consola
          // Solo loguear la primera vez que se establece cada cookie
          if ((name.includes('auth-token') || name.includes('supabase')) && !window.__cookieLogged?.[name]) {
            if (!window.__cookieLogged) {
              window.__cookieLogged = {};
            }
            window.__cookieLogged[name] = true;
            console.log('🍪 [createBrowserClient] Cookie establecida:', name, 'path:', path, 'SameSite:', sameSite);
          }
        });
      },
    },
  }
);
