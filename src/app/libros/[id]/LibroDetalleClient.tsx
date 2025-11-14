"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "@/app/GoogleSignInButton";

type Libro = {
  id: number;
  titulo: string;
  autor: string;
  descripcion?: string;
  precio: number;
  portada_url?: string;
  categoria?: string;
  fecha_publicacion?: string;
  archivo_pdf_url?: string;
};

type LibroDetalleClientProps = {
  libro: Libro;
  estaComprado: boolean;
  user: User | null;
};

export default function LibroDetalleClient({ libro, estaComprado: initialEstaComprado, user: initialUser }: LibroDetalleClientProps) {
  const [cargando, setCargando] = useState(false);
  const [user, setUser] = useState<User | null>(initialUser);
  const [estaComprado, setEstaComprado] = useState(initialEstaComprado);
  const router = useRouter();

  // Verificar el usuario en el cliente para asegurar que tenemos la sesión actualizada
  useEffect(() => {
    // Si ya tenemos el usuario inicial, usarlo directamente
    if (initialUser) {
      setUser(initialUser);
      // Verificar compra con el usuario inicial
      if (initialUser) {
        (async () => {
          try {
            const { data, error } = await supabase
              .from("compras_libros")
              .select("id")
              .eq("user_id", initialUser.id)
              .eq("libro_id", libro.id)
              .eq("estado_pago", "completado")
              .single();
            
            if (error) {
              if (error.code === 'PGRST116') {
                // No rows returned - es normal si no ha comprado
                setEstaComprado(false);
              } else {
                const errorMessage = error.message || '';
                if (errorMessage.includes('406') || (error as any).status === 406) {
                  // Error 406 - establecer explícitamente como no comprado
                  // Esto evita que el libro se muestre como comprado cuando hay un error RLS
                  console.warn('⚠️ Error 406 al verificar compra (estableciendo como no comprado):', errorMessage);
                  setEstaComprado(false);
                } else {
                  console.error('Error al verificar compra:', error);
                  // En caso de otros errores, establecer como no comprado por seguridad
                  setEstaComprado(false);
                }
              }
            } else {
              // Solo establecer como comprado si hay datos explícitos
              setEstaComprado(!!data);
            }
          } catch (error) {
            // En caso de error inesperado, establecer como no comprado por seguridad
            console.warn('⚠️ Error al verificar compra (estableciendo como no comprado):', error);
            setEstaComprado(false);
          }
        })();
      }
      return; // No hacer más llamadas si ya tenemos el usuario
    }

    // Solo obtener usuario si no hay usuario inicial
    const checkUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        // Si hay usuario, verificar si compró el libro
        if (currentUser) {
          const { data: compra, error } = await supabase
            .from("compras_libros")
            .select("id")
            .eq("user_id", currentUser.id)
            .eq("libro_id", libro.id)
            .eq("estado_pago", "completado")
            .single();

          if (error) {
            if (error.code === 'PGRST116') {
              // No rows returned - es normal si no ha comprado
              setEstaComprado(false);
            } else {
              const errorMessage = error.message || '';
              if (errorMessage.includes('406') || (error as any).status === 406) {
                // Error 406 - establecer explícitamente como no comprado
                console.warn('⚠️ Error 406 al verificar compra (estableciendo como no comprado):', errorMessage);
                setEstaComprado(false);
              } else {
                console.error('Error al verificar compra:', error);
                // En caso de otros errores, establecer como no comprado por seguridad
                setEstaComprado(false);
              }
            }
          } else {
            // Solo establecer como comprado si hay datos explícitos
            setEstaComprado(!!compra);
          }
        }
      } catch (error: any) {
        // Ignorar errores 429 silenciosamente
        if (error?.status !== 429 && error?.message?.includes('429') === false) {
          console.error('Error al obtener usuario:', error);
        }
      }
    };

    checkUser();

    // Debounce para evitar múltiples llamadas que causan error 429
    let timeoutId: NodeJS.Timeout;
    let lastEventTime = 0;
    const DEBOUNCE_MS = 1000; // Esperar 1 segundo entre cambios

    // Escuchar cambios en la autenticación
    // IMPORTANTE: NO verificar compra automáticamente después de autenticarse
    // Solo actualizar el estado del usuario, la verificación de compra se hace al cargar la página
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Ignorar TODOS los eventos excepto SIGNED_OUT
      // Esto evita cualquier acción automática después de autenticarse
      if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        // Solo actualizar el usuario sin hacer consultas adicionales ni verificar compras
        if (session?.user) {
          console.log('🔄 LibroDetalleClient: Actualizando usuario desde', event, '- NO verificando compra');
          setUser(session.user);
        }
        return;
      }
      
      // Solo procesar SIGNED_OUT
      if (event === 'SIGNED_OUT') {
        console.log('🔄 LibroDetalleClient: Usuario deslogueado');
        setUser(null);
        setEstaComprado(false);
        return;
      }
      
      // Para otros eventos, solo actualizar el usuario sin verificar compra
      const now = Date.now();
      
      // Solo procesar si ha pasado suficiente tiempo desde el último evento
      if (now - lastEventTime < DEBOUNCE_MS) {
        clearTimeout(timeoutId);
      }
      
      lastEventTime = now;
      
      timeoutId = setTimeout(() => {
        console.log('🔄 LibroDetalleClient: Cambio de autenticación:', event, '- NO verificando compra automáticamente');
        setUser(session?.user ?? null);
        if (!session?.user) {
          setEstaComprado(false);
        }
        // NO verificar compra aquí - solo se verifica al cargar la página
      }, DEBOUNCE_MS);
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [libro.id]);

  const handleComprar = async () => {
    // Protección: no permitir comprar si no hay PDF disponible
    if (!libro.archivo_pdf_url) {
      console.warn('⚠️ Intento de comprar un libro sin PDF disponible');
      return;
    }

    // Protección adicional: verificar que el usuario está autenticado y el libro no está comprado
    if (!user) {
      // Si no está autenticado, redirigir al inicio para que inicie sesión
      router.push("/");
      return;
    }

    // Protección: no permitir comprar si ya está comprado
    if (estaComprado) {
      console.warn('⚠️ Intento de comprar un libro que ya está comprado');
      return;
    }

    // Si el precio es 0, procesar compra gratuita automáticamente
    if (libro.precio === 0 || libro.precio === null || libro.precio === undefined) {
      setCargando(true);
      try {
        const response = await fetch('/api/libros/comprar-gratis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ libroId: libro.id }),
        });

        const data = await response.json() as { error?: string; success?: boolean; message?: string };

        if (!response.ok) {
          console.error('Error al obtener libro gratuito:', data.error);
          alert(data.error || 'Error al obtener el libro. Por favor, intenta de nuevo.');
          setCargando(false);
          return;
        }

        // Actualizar el estado para reflejar que el libro está comprado
        setEstaComprado(true);
        
        // Redirigir a la página de lectura
        router.push(`/libros/${libro.id}/leer`);
      } catch (error) {
        console.error('Error al procesar compra gratuita:', error);
        alert('Error al obtener el libro. Por favor, intenta de nuevo.');
        setCargando(false);
      }
      return;
    }

    // Solo redirigir a checkout si el usuario hace clic explícitamente
    // Esta función solo se llama desde el onClick del botón
    router.push(`/libros/${libro.id}/checkout`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href="/libros"
        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a la biblioteca
      </Link>

      <div className="grid md:grid-cols-2 gap-8 bg-gray-800/50 rounded-lg p-6">
        {/* Portada */}
        <div className="aspect-[2/3] relative bg-gray-700 rounded-lg overflow-hidden">
          {libro.portada_url ? (
            <img
              src={libro.portada_url}
              alt={libro.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{libro.titulo}</h1>
            <p className="text-xl text-gray-300 mb-4">{libro.autor}</p>
            {libro.categoria && (
              <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                {libro.categoria}
              </span>
            )}
          </div>

          {libro.descripcion && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Descripción</h2>
              <p className="text-gray-300 leading-relaxed">{libro.descripcion}</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-700">
            {estaComprado ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold">Libro comprado</span>
                </div>
                {libro.archivo_pdf_url ? (
                  <Link
                    href={`/libros/${libro.id}/leer`}
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Leer ahora
                  </Link>
                ) : (
                  <p className="text-gray-400 text-sm">El archivo PDF estará disponible pronto.</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {(libro.precio === 0 || libro.precio === null || libro.precio === undefined) ? (
                    <span 
                      className="text-3xl font-bold px-3 py-1.5 rounded inline-block bg-green-600 text-white"
                      style={{
                        fontFamily: 'sans-serif'
                      }}
                    >
                      Gratis
                    </span>
                  ) : (
                    <span 
                      className="text-3xl font-bold px-3 py-1.5 rounded inline-block"
                      style={{
                        backgroundColor: '#0a1929',
                        color: '#facc15',
                        fontFamily: 'sans-serif'
                      }}
                    >
                      ${libro.precio.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP
                    </span>
                  )}
                </div>
                {!libro.archivo_pdf_url ? (
                  <div className="space-y-3">
                    <div className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold text-center cursor-not-allowed opacity-75">
                      No disponible aún
                    </div>
                    <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 px-4 py-3 rounded-lg">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-sm">
                        El PDF de este libro aún no está disponible. Estará disponible próximamente.
                      </p>
                    </div>
                  </div>
                ) : user ? (
                  <button
                    onClick={handleComprar}
                    disabled={cargando || estaComprado}
                    className="w-full px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {cargando ? "Procesando..." : (libro.precio === 0 || libro.precio === null || libro.precio === undefined) ? "Obtener gratis" : "Comprar ahora"}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-400 text-center">
                      Debes iniciar sesión con Google para comprar este libro
                    </p>
                    <div className="flex justify-center">
                      <GoogleSignInButton />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

