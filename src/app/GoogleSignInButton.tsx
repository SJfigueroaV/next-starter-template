// components/GoogleSignInButton.tsx
'use client';

import { supabase } from '../supabaseClient';
import { usePathname } from 'next/navigation';

export default function GoogleSignInButton() {
  const pathname = usePathname();
  
  const handleSignIn = async () => {
    // Guardar la ruta actual en localStorage para redirigir después del login
    if (typeof window !== 'undefined') {
      localStorage.setItem('redirectAfterAuth', pathname || '/');
      console.log('🔵 Guardando ruta de redirección:', pathname || '/');
    }
    
    // Obtener la URL actual (funciona tanto en localhost como en producción)
    // IMPORTANTE: Si estamos en HTTPS (ngrok), asegurar que el callback también use HTTPS
    const redirectTo = typeof window !== 'undefined' 
      ? `${window.location.origin}/auth/callback`
      : 'http://localhost:3000/auth/callback';

    console.log('🔵 Iniciando flujo OAuth con PKCE...');
    console.log('🔵 RedirectTo:', redirectTo);
    console.log('🔵 Protocolo actual:', typeof window !== 'undefined' ? window.location.protocol : 'unknown');
    console.log('🔵 Origin actual:', typeof window !== 'undefined' ? window.location.origin : 'unknown');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        // PKCE está configurado globalmente en supabaseClient.ts
      },
    });
    
    if (error) {
      console.error('❌ Error al iniciar sesión:', error.message);
    } else if (data?.url) {
      // createClient con storage adapter personalizado guarda el code verifier automáticamente
      // Esperar un momento para asegurar que se guarde en localStorage
      console.log('⏳ Esperando a que el code verifier se guarde...');
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verificar si se guardó el code verifier y hacer una copia en sessionStorage como respaldo
      const storageKeys = typeof window !== 'undefined' ? Object.keys(localStorage) : [];
      const codeVerifierKeys = storageKeys.filter(k => 
        k.toLowerCase().includes('code') || 
        k.toLowerCase().includes('verifier') || 
        k.toLowerCase().includes('pkce') ||
        k.includes('supabase')
      );
      console.log('🔍 Claves relacionadas con PKCE después de signInWithOAuth:', codeVerifierKeys.length);
      if (codeVerifierKeys.length > 0) {
        console.log('✅ Code verifier guardado:', codeVerifierKeys);
        
        // Hacer una copia en sessionStorage Y cookies como respaldo
        // Las cookies persisten entre redirecciones del mismo origen
        codeVerifierKeys.forEach(key => {
          const value = localStorage.getItem(key);
          if (value && typeof window !== 'undefined') {
            // Copia en sessionStorage
            sessionStorage.setItem(`backup_${key}`, value);
            console.log('💾 Copia de seguridad guardada en sessionStorage:', key);
            
            // Copia en cookies (persisten entre redirecciones)
            // IMPORTANTE: Si estamos en HTTPS, las cookies con SameSite=None; Secure solo funcionan en HTTPS
            // Si el callback llega a HTTP, las cookies no estarán disponibles
            const cookieName = `backup_${key}`.replace(/[^a-zA-Z0-9_-]/g, '_');
            const isSecure = window.location.protocol === 'https:';
            const sameSite = isSecure ? 'SameSite=None; Secure' : 'SameSite=Lax';
            const cookieValue = encodeURIComponent(value);
            const cookieString = `${cookieName}=${cookieValue}; path=/; max-age=600; ${sameSite}`;
            document.cookie = cookieString;
            console.log('🍪 Copia de seguridad guardada en cookie:', cookieName, `(${sameSite})`);
            console.log('🍪 Cookie string (primeros 100 chars):', cookieString.substring(0, 100) + '...');
            
            // Verificar que la cookie se guardó correctamente
            const verifyCookie = document.cookie.split(';').find(c => c.trim().startsWith(cookieName + '='));
            if (verifyCookie) {
              console.log('✅ Cookie verificada después de guardar');
            } else {
              console.warn('⚠️ Cookie no encontrada después de guardar. Puede ser un problema de SameSite/Secure');
            }
          }
        });
      } else {
        console.warn('⚠️ No se encontraron claves de PKCE en localStorage');
        console.warn('⚠️ Esto puede causar problemas en el callback');
      }
      
      console.log('🔄 Redirigiendo a OAuth...');
      window.location.href = data.url;
    }
  };

  return (
    <button className='inline-flex items-center justify-center px-2 py-1 text-sm font-bold text-center text-black transition bg-white rounded-lg md:px-4 md:py-2 hover:bg-yellow-200 md:text-base'  onClick={handleSignIn}>
      <svg className="w-6 h-6 mr-2" width="256" height="262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path></svg>
      Iniciar sesión con Google
    </button>
  );
}
