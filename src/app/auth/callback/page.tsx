"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabaseClient';

// Función helper para verificar que la sesión esté establecida y persistida
const waitForSession = async (maxWait = 3000): Promise<boolean> => {
  const startTime = Date.now();
  while (Date.now() - startTime < maxWait) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      console.log('✅ Sesión verificada y persistida');
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  console.warn('⚠️ No se pudo verificar la sesión después de esperar');
  return false;
};

export default function AuthCallback() {
  const router = useRouter();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevenir ejecución múltiple (React Strict Mode en desarrollo)
    if (hasProcessed.current) {
      console.log('⚠️ Callback ya procesado, ignorando ejecución duplicada');
      return;
    }
    
    // Marcar como procesado ANTES de hacer cualquier cosa asíncrona
    // Esto previene que se ejecute dos veces incluso si hay delays
    hasProcessed.current = true;

    const handleAuthCallback = async () => {
      try {
        // Obtener la ruta guardada antes de autenticarse
        const redirectTo = typeof window !== 'undefined' 
          ? localStorage.getItem('redirectAfterAuth') || '/'
          : '/';
        
        // Limpiar el redirect guardado
        if (typeof window !== 'undefined') {
          localStorage.removeItem('redirectAfterAuth');
        }
        
        // Verificar si hay un código en la URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        console.log('🔵 Callback cliente - Código presente:', !!code);
        
        if (code) {
          console.log('🔵 Código OAuth detectado:', code.substring(0, 20) + '...');
          console.log('🔵 Con PKCE y detectSessionInUrl: true, Supabase debería procesar automáticamente');
          
          // IMPORTANTE: Con detectSessionInUrl: true, Supabase procesa el código automáticamente
          // cuando se crea el cliente. Necesitamos esperar a que esto suceda.
          // El código se procesa en el constructor del cliente, así que esperamos un momento
          console.log('⏳ Esperando a que Supabase procese el código automáticamente...');
          
          // Esperar y verificar periódicamente si la sesión se estableció
          let sessionFound = false;
          for (let i = 0; i < 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              console.log('✅ Sesión establecida automáticamente por Supabase (intento', i + 1, ')');
              console.log('✅ Usuario:', session.user.email);
              sessionFound = true;
              
              // Esperar más tiempo para que las cookies se establezcan
              console.log('⏳ Esperando a que las cookies se establezcan completamente...');
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // Verificar cookies en el navegador antes de redirigir
              const browserCookies = document.cookie.split(';').map(c => c.trim());
              const supabaseCookiesInBrowser = browserCookies.filter(c => 
                c.startsWith('sb-') || 
                c.includes('auth-token') ||
                c.includes('supabase')
              );
              console.log('🍪 Cookies en el navegador antes de redirigir:', supabaseCookiesInBrowser.length);
              if (supabaseCookiesInBrowser.length > 0) {
                console.log('  ✅ Cookies encontradas:', supabaseCookiesInBrowser.map(c => c.split('=')[0]).join(', '));
              } else {
                console.warn('  ⚠️ No se encontraron cookies de Supabase en el navegador');
              }
              
              // Verificar una última vez que la sesión persiste
              const { data: { session: finalCheck } } = await supabase.auth.getSession();
              if (finalCheck) {
                console.log('✅ Sesión verificada y persistida correctamente');
                console.log('✅ Usuario final:', finalCheck.user.email);
                
                // Verificar y procesar pagos pendientes vinculados al email
                try {
                  console.log('🔍 Verificando pagos pendientes...');
                  const response = await fetch('/api/pagos/verificar-pendientes', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  if (response.ok) {
                    const data = await response.json() as { procesadas?: number; total?: number };
                    if (data.procesadas && data.procesadas > 0) {
                      console.log(`✅ ${data.procesadas} pago(s) pendiente(s) procesado(s)`);
                    }
                  } else {
                    console.warn('⚠️ Error al verificar pagos pendientes (no crítico)');
                  }
                } catch (error) {
                  console.warn('⚠️ Error al verificar pagos pendientes (no crítico):', error);
                }
                
                console.log('🔄 Redirigiendo a:', redirectTo);
                window.location.href = redirectTo;
                return;
              } else {
                console.warn('⚠️ Sesión se perdió después de establecerse');
              }
              break;
            }
          }
          
          if (!sessionFound) {
            console.warn('⚠️ Sesión no se estableció automáticamente después de 5 segundos');
          }
          
          // Si no se estableció automáticamente, usar onAuthStateChange como fallback
          console.log('⚠️ Sesión no detectada automáticamente. Escuchando eventos...');
          let sessionDetected = false;
          let detectedSession: any = null;
          let lastEvent: string | null = null;
          
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔄 Evento de autenticación:', event, session ? 'con sesión' : 'sin sesión');
            lastEvent = event;
            // Aceptar cualquier evento que tenga sesión
            if (session) {
              console.log('✅ Sesión detectada a través de onAuthStateChange:', event);
              sessionDetected = true;
              detectedSession = session;
            }
          });
          
          // Esperar hasta 5 segundos para que Supabase procese
          const maxWait = 5000;
          const startTime = Date.now();
          while (!sessionDetected && Date.now() - startTime < maxWait) {
            await new Promise(resolve => setTimeout(resolve, 200));
            // Verificar periódicamente si la sesión se estableció
            const { data: { session } } = await supabase.auth.getSession();
            if (session && !sessionDetected) {
              console.log('✅ Sesión encontrada durante la espera');
              sessionDetected = true;
              detectedSession = session;
              break;
            }
          }
          
          console.log('⏱️ Tiempo de espera completado. Último evento:', lastEvent);
          
          // Limpiar el listener
          subscription.unsubscribe();
          
          if (sessionDetected && detectedSession) {
            console.log('✅ Sesión establecida automáticamente (PKCE)');
            console.log('✅ Usuario:', detectedSession.user.email);
            
            // Esperar más tiempo para que las cookies se establezcan y propaguen
            console.log('⏳ Esperando a que las cookies se establezcan completamente...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Verificar cookies en el navegador antes de redirigir
            const browserCookies = document.cookie.split(';').map(c => c.trim());
            const supabaseCookiesInBrowser = browserCookies.filter(c => 
              c.startsWith('sb-') || 
              c.includes('auth-token') ||
              c.includes('supabase')
            );
            console.log('🍪 Cookies en el navegador antes de redirigir:', supabaseCookiesInBrowser.length);
            if (supabaseCookiesInBrowser.length > 0) {
              console.log('  ✅ Cookies encontradas:', supabaseCookiesInBrowser.map(c => c.split('=')[0]).join(', '));
            } else {
              console.warn('  ⚠️ No se encontraron cookies de Supabase en el navegador');
            }
            
            // Verificar una última vez que la sesión persiste antes de redirigir
            const { data: { session: finalCheck } } = await supabase.auth.getSession();
            if (!finalCheck) {
              console.warn('⚠️ Sesión se perdió antes de redirigir. Esperando más tiempo...');
              await new Promise(resolve => setTimeout(resolve, 2000));
              const { data: { session: retryCheck } } = await supabase.auth.getSession();
              if (!retryCheck) {
                console.error('❌ Sesión no persiste después de esperar. Esto puede causar problemas.');
                console.error('💡 La sesión puede estar en el cliente pero no en las cookies del servidor');
                console.error('💡 Esto puede pasar si las cookies no se establecieron correctamente');
              } else {
                console.log('✅ Sesión recuperada después de esperar');
              }
            } else {
              console.log('✅ Sesión verificada y persistida correctamente');
              console.log('✅ Usuario final:', finalCheck.user.email);
              
              // Verificar y procesar pagos pendientes vinculados al email
              try {
                console.log('🔍 Verificando pagos pendientes...');
                const response = await fetch('/api/pagos/verificar-pendientes', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
                
                if (response.ok) {
                  const data = await response.json() as { procesadas?: number; total?: number };
                  if (data.procesadas && data.procesadas > 0) {
                    console.log(`✅ ${data.procesadas} pago(s) pendiente(s) procesado(s)`);
                  }
                } else {
                  console.warn('⚠️ Error al verificar pagos pendientes (no crítico)');
                }
              } catch (error) {
                console.warn('⚠️ Error al verificar pagos pendientes (no crítico):', error);
              }
            }
            
            // Redirigir - usar href para asegurar que las cookies se envíen
            console.log('🔄 Redirigiendo a:', redirectTo);
            // Forzar una recarga completa para asegurar que las cookies se lean en el servidor
            window.location.href = redirectTo;
            return;
          }
          
          // Si no se estableció automáticamente, verificar manualmente
          console.log('⚠️ Sesión no detectada automáticamente. Verificando manualmente...');
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (session) {
            console.log('✅ Sesión encontrada en verificación manual');
            console.log('✅ Usuario:', session.user.email);
            
            // Verificar y procesar pagos pendientes
            try {
              console.log('🔍 Verificando pagos pendientes...');
              const response = await fetch('/api/pagos/verificar-pendientes', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              
              if (response.ok) {
                const data = await response.json() as { procesadas?: number; total?: number };
                if (data.procesadas && data.procesadas > 0) {
                  console.log(`✅ ${data.procesadas} pago(s) pendiente(s) procesado(s)`);
                }
              }
            } catch (error) {
              console.warn('⚠️ Error al verificar pagos pendientes (no crítico):', error);
            }
            
            // Verificar que persiste antes de redirigir
            await new Promise(resolve => setTimeout(resolve, 500));
            const { data: { session: finalCheck } } = await supabase.auth.getSession();
            if (finalCheck) {
              console.log('🔄 Redirigiendo a:', redirectTo);
              window.location.replace(redirectTo);
            } else {
              console.warn('⚠️ Sesión se perdió. Redirigiendo de todas formas...');
              window.location.replace(redirectTo);
            }
            return;
          }
          
          // Si aún no hay sesión, intentar intercambio manual
          console.log('⚠️ Intentando intercambio manual del código...');
          
          // Verificar nuevamente el localStorage antes de intentar
          const storageKeys2 = typeof window !== 'undefined' ? Object.keys(localStorage) : [];
          console.log('🔍 Todas las claves en localStorage:', storageKeys2.length);
          console.log('🔍 Claves de Supabase:', storageKeys2.filter(k => k.includes('supabase') || k.includes('auth') || k.includes('sb-')));
          console.log('🔍 Claves relacionadas con PKCE:', storageKeys2.filter(k => 
            k.toLowerCase().includes('code') || 
            k.toLowerCase().includes('verifier') || 
            k.toLowerCase().includes('pkce')
          ));
          
          // Si no hay claves de Supabase, intentar recuperar desde sessionStorage (copia de seguridad)
          const supabaseKeys = storageKeys2.filter(k => k.includes('supabase') || k.includes('auth') || k.includes('sb-'));
          if (supabaseKeys.length === 0) {
            console.warn('⚠️ No se encontraron claves de Supabase en localStorage');
            console.log('🔄 Intentando recuperar desde sessionStorage (copia de seguridad)...');
            
            // Buscar copias de seguridad en sessionStorage primero
            const sessionKeys = typeof window !== 'undefined' ? Object.keys(sessionStorage) : [];
            console.log('🔍 Todas las claves en sessionStorage:', sessionKeys.length);
            console.log('🔍 Claves en sessionStorage:', sessionKeys);
            let backupKeys = sessionKeys.filter(k => k.startsWith('backup_') && (k.includes('code') || k.includes('verifier') || k.includes('pkce')));
            console.log('🔍 Claves de respaldo en sessionStorage:', backupKeys.length, backupKeys);
            
            // Si no hay en sessionStorage, buscar en cookies
            if (backupKeys.length === 0 && typeof window !== 'undefined') {
              console.log('🔄 Buscando copias de seguridad en cookies...');
              const cookies = document.cookie ? document.cookie.split(';').map(c => c.trim()).filter(c => c.length > 0) : [];
              console.log('🍪 Todas las cookies disponibles:', cookies.length);
              if (cookies.length > 0) {
                console.log('🍪 Nombres de cookies:', cookies.map(c => {
                  const parts = c.split('=');
                  return parts[0] || '(sin nombre)';
                }));
              }
              const cookieBackups: { key: string; value: string }[] = [];
              cookies.forEach(cookie => {
                const equalIndex = cookie.indexOf('=');
                if (equalIndex > 0) {
                  const name = cookie.substring(0, equalIndex).trim();
                  const value = cookie.substring(equalIndex + 1).trim();
                  if (name.startsWith('backup_') && (name.includes('code') || name.includes('verifier') || name.includes('pkce'))) {
                    try {
                      cookieBackups.push({ key: name, value: decodeURIComponent(value) });
                    } catch (e) {
                      console.warn('⚠️ Error al decodificar cookie:', name, e);
                    }
                  }
                }
              });
              console.log('🍪 Copias de seguridad en cookies:', cookieBackups.length);
              if (cookieBackups.length > 0) {
                console.log('🍪 Claves de respaldo encontradas:', cookieBackups.map(c => c.key));
              }
              if (cookieBackups.length > 0) {
                // Convertir cookies a formato de sessionStorage para procesamiento uniforme
                cookieBackups.forEach(({ key, value }) => {
                  sessionStorage.setItem(key, value);
                  backupKeys.push(key);
                });
                console.log('✅ Restauradas desde cookies a sessionStorage');
              }
            }
            
            if (backupKeys.length > 0) {
              console.log('✅ Encontradas copias de seguridad:', backupKeys.length);
              // Restaurar desde sessionStorage a localStorage
              backupKeys.forEach(backupKey => {
                const originalKey = backupKey.replace('backup_', '');
                const value = sessionStorage.getItem(backupKey);
                if (value && typeof window !== 'undefined') {
                  localStorage.setItem(originalKey, value);
                  console.log('✅ Restaurado desde respaldo:', originalKey);
                }
              });
              
              // Limpiar las copias de seguridad después de restaurar
              backupKeys.forEach(key => {
                sessionStorage.removeItem(key);
                // También limpiar la cookie
                if (typeof window !== 'undefined') {
                  const cookieName = key.replace(/[^a-zA-Z0-9_-]/g, '_');
                  const isSecure = window.location.protocol === 'https:';
                  const sameSite = isSecure ? 'SameSite=None; Secure' : 'SameSite=Lax';
                  document.cookie = `${cookieName}=; path=/; max-age=0; ${sameSite}`;
                }
              });
            } else {
              console.error('❌ No se encontraron copias de seguridad en sessionStorage');
              console.error('❌ Esto significa que el code verifier nunca se guardó durante signInWithOAuth');
              console.error('💡 Posibles causas:');
              console.error('  1. createClient no está guardando el code verifier correctamente');
              console.error('  2. El localStorage se limpió durante la redirección');
              console.error('  3. Hay un problema con la configuración de PKCE');
              window.location.href = `/?error=${encodeURIComponent('code_verifier_not_saved')}&reason=localStorage_empty`;
              return;
            }
          }
          
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('❌ Error al intercambiar código:', error);
            console.error('❌ Detalles del error:', {
              message: error.message,
              status: error.status,
              code: error.code
            });
            
                   // Si el error es sobre code verifier, puede ser que se perdió en localStorage
                   if (error.message?.includes('code verifier') || error.message?.includes('code_verifier')) {
                     console.error('⚠️ Code verifier no encontrado. Esto puede pasar si:');
                     console.error('  1. El localStorage se limpió durante la redirección');
                     console.error('  2. El flujo OAuth no se inició correctamente');
                     console.error('  3. Hay un problema con la configuración de PKCE');
                     console.error('  4. El code verifier expiró (PKCE tiene un tiempo límite)');
                     console.error('💡 Solución: Intenta iniciar sesión de nuevo desde cero');
                     console.error('💡 Asegúrate de no limpiar el localStorage durante la redirección');
              
              // Intentar una última vez después de un breve delay
              console.log('🔄 Intentando una última vez después de un delay...');
              await new Promise(resolve => setTimeout(resolve, 1000));
              const { data: retryData, error: retryError } = await supabase.auth.exchangeCodeForSession(code);
              if (retryError) {
                window.location.href = `/?error=${encodeURIComponent(error.message)}&retry_failed=true`;
                return;
              } else if (retryData?.session) {
                console.log('✅ Sesión establecida en el reintento');
                await waitForSession();
                await new Promise(resolve => setTimeout(resolve, 1000));
                window.location.href = redirectTo;
                return;
              }
            }
            
            window.location.href = `/?error=${encodeURIComponent(error.message)}`;
            return;
          }
          
          if (data.session) {
            console.log('✅ Sesión establecida manualmente');
            console.log('✅ Usuario:', data.session.user.email);
            
            // Verificar y procesar pagos pendientes
            try {
              console.log('🔍 Verificando pagos pendientes...');
              const response = await fetch('/api/pagos/verificar-pendientes', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              
              if (response.ok) {
                const data = await response.json() as { procesadas?: number; total?: number };
                if (data.procesadas && data.procesadas > 0) {
                  console.log(`✅ ${data.procesadas} pago(s) pendiente(s) procesado(s)`);
                }
              }
            } catch (error) {
              console.warn('⚠️ Error al verificar pagos pendientes (no crítico):', error);
            }
            
            // Verificar que la sesión esté persistida antes de redirigir
            console.log('⏳ Verificando que la sesión esté persistida...');
            await waitForSession();
            // Esperar un poco más para asegurar propagación al servidor
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('🔄 Redirigiendo a:', redirectTo);
            window.location.href = redirectTo;
            return;
          } else {
            console.warn('⚠️ No se recibió sesión después del intercambio manual');
            // Si llegamos aquí, el código estaba presente pero no se pudo establecer la sesión
            console.error('❌ No se pudo establecer sesión con el código proporcionado');
            window.location.href = `/?error=no_session&reason=exchange_failed`;
            return;
          }
        }

        // Si no hay código, verificar si ya hay una sesión (PKCE flow automático)
        console.log('🔵 No hay código en la URL. Verificando sesión existente...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('✅ Sesión encontrada (PKCE flow automático)');
          console.log('✅ Usuario:', session.user.email);
          
          // Verificar y procesar pagos pendientes
          try {
            console.log('🔍 Verificando pagos pendientes...');
            const response = await fetch('/api/pagos/verificar-pendientes', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (response.ok) {
              const data = await response.json() as { procesadas?: number; total?: number };
              if (data.procesadas && data.procesadas > 0) {
                console.log(`✅ ${data.procesadas} pago(s) pendiente(s) procesado(s)`);
              }
            }
          } catch (error) {
            console.warn('⚠️ Error al verificar pagos pendientes (no crítico):', error);
          }
          
          // Verificar que la sesión esté persistida antes de redirigir
          console.log('⏳ Verificando que la sesión esté persistida...');
          await waitForSession();
          // Esperar un poco más para asegurar propagación al servidor
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('🔄 Redirigiendo a:', redirectTo);
          window.location.href = redirectTo;
        } else {
          console.warn('⚠️ No hay sesión. Esperando un momento...');
          // Esperar un momento por si la sesión se está estableciendo
          await new Promise(resolve => setTimeout(resolve, 2000));
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (retrySession) {
            console.log('✅ Sesión encontrada después de esperar');
            console.log('✅ Usuario:', retrySession.user.email);
            
            // Verificar y procesar pagos pendientes
            try {
              console.log('🔍 Verificando pagos pendientes...');
              const response = await fetch('/api/pagos/verificar-pendientes', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              
              if (response.ok) {
                const data = await response.json() as { procesadas?: number; total?: number };
                if (data.procesadas && data.procesadas > 0) {
                  console.log(`✅ ${data.procesadas} pago(s) pendiente(s) procesado(s)`);
                }
              }
            } catch (error) {
              console.warn('⚠️ Error al verificar pagos pendientes (no crítico):', error);
            }
            
            // Verificar que la sesión esté persistida
            await waitForSession();
            await new Promise(resolve => setTimeout(resolve, 1000));
            window.location.href = redirectTo;
          } else {
            console.error('❌ No se pudo obtener sesión después del login');
            console.error('❌ Esto puede pasar si:');
            console.error('  1. El código OAuth expiró');
            console.error('  2. El code verifier se perdió');
            console.error('  3. Hay un problema con la configuración de PKCE');
            window.location.href = `/?error=no_session&reason=timeout`;
          }
        }
      } catch (error: any) {
        console.error('❌ Error en callback:', error);
        window.location.href = `/?error=${encodeURIComponent(error?.message || 'callback_error')}`;
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Procesando autenticación...</p>
      </div>
    </div>
  );
}

