"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";

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

type LibrosClientProps = {
  libros: Libro[];
  categorias: string[];
  error: any;
  initialUser?: User | null;
};

export default function LibrosClient({ libros, categorias, error, initialUser = null }: LibrosClientProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [librosComprados, setLibrosComprados] = useState<number[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("Todos los títulos");
  const [busqueda, setBusqueda] = useState<string>("");
  const [orden, setOrden] = useState<string>("Reciente");
  const [librosHorizontales, setLibrosHorizontales] = useState<{ [key: number]: boolean }>({});
  const [verificandoPagos, setVerificandoPagos] = useState(false);

  // Logging para debugging
  useEffect(() => {
    if (initialUser) {
      console.log('✅ LibrosClient: Usuario inicial recibido del servidor:', initialUser.email);
      setUser(initialUser);
    } else {
      console.warn('⚠️ LibrosClient: No se recibió usuario inicial del servidor');
    }
  }, [initialUser]);

  useEffect(() => {
    // Si ya tenemos el usuario del servidor, usarlo directamente
    // Esto evita llamar a getSession() que puede causar error 429
    if (initialUser) {
      console.log('✅ LibrosClient: Estableciendo usuario inicial:', initialUser.email);
      setUser(initialUser);
      // NO hacer más llamadas si ya tenemos el usuario del servidor
      // Solo suscribirse a onAuthStateChange para cambios reales
    } else {
      // Solo obtener sesión si no hay usuario inicial
      // Usar getUser() en lugar de getSession() para evitar refresh automático
      const getInitialUser = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            console.log('✅ LibrosClient: Usuario obtenido del cliente:', user.email);
            setUser(user);
          } else {
            console.warn('⚠️ LibrosClient: No se encontró usuario en el cliente');
          }
        } catch (error: any) {
          // Ignorar errores 429 silenciosamente
          if (error?.status !== 429 && error?.message?.includes('429') === false) {
            console.error('Error al obtener usuario:', error);
          }
        }
      };
      getInitialUser();
    }

    // Debounce para evitar múltiples llamadas que causan error 429
    let timeoutId: NodeJS.Timeout;
    let lastEventTime = 0;
    const DEBOUNCE_MS = 1500; // Aumentado a 1.5 segundos

    // Escuchar cambios en la autenticación para actualizar el estado
    // IMPORTANTE: Solo actualizar si realmente cambió el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Ignorar eventos que no cambian el estado de autenticación
      // Si ya tenemos initialUser, ignorar estos eventos para evitar sobrescribir
      if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        // Solo actualizar el usuario si no tenemos uno ya establecido (sin initialUser)
        if (session?.user && !initialUser) {
          console.log('🔄 LibrosClient: Actualizando usuario desde TOKEN_REFRESHED/INITIAL_SESSION');
          setUser(session.user);
        } else if (initialUser) {
          // Si tenemos initialUser, ignorar estos eventos para mantener el estado
          console.log('🔄 LibrosClient: Ignorando TOKEN_REFRESHED/INITIAL_SESSION (ya tenemos initialUser)');
        }
        return;
      }
      
      // Si es SIGNED_OUT, verificar que realmente no hay sesión antes de actualizar
      // Esto evita que un error 429 cause un SIGNED_OUT falso
      if (event === 'SIGNED_OUT') {
        // Verificar si realmente no hay sesión
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user) {
          // Hay una sesión válida, ignorar el evento SIGNED_OUT
          console.log('⚠️ LibrosClient: Evento SIGNED_OUT ignorado - sesión válida encontrada');
          setUser(currentSession.user);
          return;
        } else {
          // Realmente no hay sesión, actualizar el estado
          console.log('🔄 LibrosClient: Usuario deslogueado');
          setUser(null);
          return;
        }
      }
      
      // Para SIGNED_IN, actualizar el usuario
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('🔄 LibrosClient: Usuario autenticado:', session.user.email);
        setUser(session.user);
        return;
      }
      
      const now = Date.now();
      
      // Solo procesar si ha pasado suficiente tiempo desde el último evento
      if (now - lastEventTime < DEBOUNCE_MS) {
        clearTimeout(timeoutId);
      }
      
      lastEventTime = now;
      
      timeoutId = setTimeout(() => {
        console.log('🔄 LibrosClient: Cambio de autenticación detectado:', event, session?.user?.email || 'sin usuario');
        setUser(session?.user ?? null);
      }, DEBOUNCE_MS);
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [initialUser]);

  useEffect(() => {
    const fetchLibrosComprados = async () => {
      if (!user) {
        setLibrosComprados([]);
        return;
      }
      
      try {
        console.log('🔍 Verificando pagos pendientes automáticamente...');
        setVerificandoPagos(true);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
        
        const response = await fetch('/api/pagos/verificar-pendientes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json() as { procesadas?: number; total?: number; error?: string };
          if (data && typeof data === 'object' && 'procesadas' in data && data.procesadas && data.procesadas > 0) {
            console.log(`✅ ${data.procesadas} pago(s) pendiente(s) procesado(s) automáticamente`);
            
            // Mostrar notificación sutil al usuario
            if (typeof window !== 'undefined') {
              // Podrías agregar un toast aquí si tienes una librería de notificaciones
              console.log('🎉 ¡Pagos pendientes procesados exitosamente!');
            }
          }
        } else {
          console.warn('⚠️ Error al verificar pagos pendientes automáticamente (continuando...):', response.status);
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.warn('⚠️ Verificación automática cancelada por timeout');
        } else {
          console.warn('⚠️ Error al verificar pagos pendientes automáticamente (continuando...):', error);
        }
      } finally {
        setVerificandoPagos(false);
      }
      
      // CONTINUAR CON LA LÓGICA ORIGINAL DE OBTENER LIBROS COMPRADOS
      try {
        const { data, error } = await supabase
          .from("compras_libros")
          .select("libro_id")
          .eq("user_id", user.id)
          .eq("estado_pago", "completado");
        
        if (error) {
          // Ignorar errores 406 (Not Acceptable) - pueden ser temporales
          const errorMessage = error.message || '';
          if (errorMessage.includes('406') || (error as any).status === 406) {
            console.warn('⚠️ Error 406 al obtener libros comprados (ignorado):', errorMessage);
            return;
          }
          console.error('Error al obtener libros comprados:', error);
          return;
        }
        
        if (data) {
          setLibrosComprados(data.map((c: any) => c.libro_id));
        }
      } catch (error: any) {
        // Ignorar errores 406
        if (error?.status === 406 || error?.message?.includes('406')) {
          console.warn('⚠️ Error 406 al obtener libros comprados (ignorado)');
        } else {
          console.error('Error inesperado al obtener libros comprados:', error);
        }
      }
    };
    fetchLibrosComprados();
  }, [user]);

  // Filtrar libros
  const librosFiltrados = libros
    .filter((libro) => {
      const coincideCategoria = categoriaSeleccionada === "Todos los títulos" || libro.categoria === categoriaSeleccionada;
      const coincideBusqueda = 
        !busqueda ||
        libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        libro.autor.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    })
    .sort((a, b) => {
      if (orden === "Reciente") {
        return new Date(b.fecha_publicacion || 0).getTime() - new Date(a.fecha_publicacion || 0).getTime();
      }
      if (orden === "Título A-Z") {
        return a.titulo.localeCompare(b.titulo);
      }
      if (orden === "Precio") {
        return a.precio - b.precio;
      }
      return 0;
    });

  // Logging para debugging - verificar el estado del usuario antes de renderizar
  useEffect(() => {
    console.log('🔍 LibrosClient: Estado actual del usuario:', user ? user.email : 'null');
    console.log('🔍 LibrosClient: initialUser:', initialUser ? initialUser.email : 'null');
    console.log('🔍 LibrosClient: Libros comprados:', librosComprados.length);
  }, [user, initialUser, librosComprados.length]);

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-900 text-white">
      {/* Sidebar de navegación */}
      <aside className="w-full md:w-64 p-6 bg-gray-800/50 border-r border-gray-700">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Biblioteca
          </h2>
          <nav className="space-y-2">
            <button
              onClick={() => setCategoriaSeleccionada("Todos los títulos")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                categoriaSeleccionada === "Todos los títulos"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              Todos los títulos
            </button>
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => setCategoriaSeleccionada(categoria)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  categoriaSeleccionada === categoria
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {categoria}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        {/* Botón de regreso a la página principal */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la página principal
          </Link>
        </div>
        
        {/* Header con búsqueda y filtros */}
        <header className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar en tu biblioteca"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex gap-4 items-center">
              {verificandoPagos && (
                <div className="flex items-center gap-2 text-sm text-blue-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  Verificando pagos...
                </div>
              )}
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Reciente">Ordenar por: Reciente</option>
                <option value="Título A-Z">Título A-Z</option>
                <option value="Precio">Precio</option>
              </select>
            </div>
          </div>
        </header>

        {/* Grid de libros */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-400">Error al cargar los libros. Por favor, intenta más tarde.</p>
          </div>
        ) : librosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-24 h-24 mx-auto mb-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-xl font-bold mb-2">Todavía no tienes ningún libro.</p>
            <p className="text-gray-400">
              Para descubrir tu siguiente lectura,{" "}
              <Link href="/libros" className="text-blue-400 hover:underline">
                explora nuestra biblioteca
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {librosFiltrados.map((libro) => {
              const estaComprado = librosComprados.includes(libro.id);
              return (
                <Link
                  key={libro.id}
                  href={`/libros/${libro.id}`}
                  className="group relative bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200"
                >
                  <div 
                    className={`aspect-[2/3] relative overflow-hidden w-full ${librosHorizontales[libro.id] ? 'bg-gray-100' : ''}`} 
                    style={{ minHeight: '200px' }}
                  >
                    {libro.portada_url ? (
                      <>
                        <img
                          src={libro.portada_url}
                          alt={libro.titulo}
                          className="absolute inset-0 w-full h-full object-contain"
                          loading="lazy"
                          onLoad={(e) => {
                            const img = e.currentTarget;
                            const width = img.naturalWidth;
                            const height = img.naturalHeight;
                            if (width > 0 && height > 0) {
                              // Si el ancho es mayor que el alto, es horizontal
                              const esHorizontal = width > height;
                              setLibrosHorizontales(prev => ({
                                ...prev,
                                [libro.id]: esHorizontal
                              }));
                            }
                          }}
                          ref={(img) => {
                            // Verificar si la imagen ya está cargada cuando se monta el componente
                            if (img && img.complete && img.naturalWidth > 0) {
                              const width = img.naturalWidth;
                              const height = img.naturalHeight;
                              if (width > 0 && height > 0) {
                                const esHorizontal = width > height;
                                setLibrosHorizontales(prev => {
                                  // Solo actualizar si no está ya en el estado
                                  if (prev[libro.id] !== esHorizontal) {
                                    return {
                                      ...prev,
                                      [libro.id]: esHorizontal
                                    };
                                  }
                                  return prev;
                                });
                              }
                            }
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    {estaComprado && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Comprado
                      </div>
                    )}
                    {!libro.archivo_pdf_url && !estaComprado && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Próximamente
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {libro.titulo}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">{libro.autor}</p>
                    {!estaComprado && (
                      <>
                        {!libro.archivo_pdf_url ? (
                          <div className="space-y-1">
                            {(libro.precio === 0 || libro.precio === null || libro.precio === undefined) ? (
                              <p 
                                className="text-sm font-bold px-3 py-1.5 rounded inline-block bg-green-600 text-white opacity-50"
                                style={{
                                  fontFamily: 'sans-serif'
                                }}
                              >
                                Gratis
                              </p>
                            ) : (
                              <p 
                                className="text-sm font-bold px-3 py-1.5 rounded inline-block opacity-50"
                                style={{
                                  backgroundColor: '#0a1929',
                                  color: '#facc15',
                                  fontFamily: 'sans-serif'
                                }}
                              >
                                ${libro.precio.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP
                              </p>
                            )}
                            <p className="text-xs text-amber-400">PDF no disponible aún</p>
                          </div>
                        ) : (libro.precio === 0 || libro.precio === null || libro.precio === undefined) ? (
                          <p 
                            className="text-sm font-bold px-3 py-1.5 rounded inline-block bg-green-600 text-white"
                            style={{
                              fontFamily: 'sans-serif'
                            }}
                          >
                            Gratis
                          </p>
                        ) : (
                          <p 
                            className="text-sm font-bold px-3 py-1.5 rounded inline-block"
                            style={{
                              backgroundColor: '#0a1929',
                              color: '#facc15',
                              fontFamily: 'sans-serif'
                            }}
                          >
                            ${libro.precio.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

