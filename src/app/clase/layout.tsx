"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ExamenInteractivo from "@/app/ExamenInteractivo";
import { motion as motionFramer } from "framer-motion";

const MotionLink = motion(Link);

export default function ClaseLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [subtemaId, setSubtemaId] = useState<string | null>(null);
  const [estado, setEstado] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [temaGeneral, setTemaGeneral] = useState<string | null>(null);
  const [temaSlug, setTemaSlug] = useState<string | null>(null);
  const [subtemasTema, setSubtemasTema] = useState<any[]>([]);
  const [subtemaActual, setSubtemaActual] = useState<any>(null);
  const [subtemaAnterior, setSubtemaAnterior] = useState<any>(null);
  const [subtemaSiguiente, setSubtemaSiguiente] = useState<any>(null);
  const [preguntas, setPreguntas] = useState<any>(null);
  const [sonidoReproducido, setSonidoReproducido] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const params = useParams();

  const subtemaSlug = params.subtema as string;

  // Obtener el uuid del subtema por el slug
  useEffect(() => {
    console.log("subtemaSlug:", subtemaSlug); // Depuración
    const fetchSubtemaId = async () => {
      if (!subtemaSlug) return;
      // Traer el subtema y el tema general relacionado
      const { data, error } = await supabase
        .from('subtemas')
        .select('id, slug, nombre, orden, tema_general_id, temas_generales(nombre, slug, subtemas(id, slug, nombre, orden))')
        .eq('slug', subtemaSlug)
        .single();
      console.log("Respuesta de supabase:", data, error); // Depuración
      if (error) console.log("Error buscando subtema:", error);
      if (data) {
        setSubtemaId(data.id);
        // Nombre y slug del tema general
        let temaGen = null;
        let temaSlugLocal = null;
        if (Array.isArray(data.temas_generales) && data.temas_generales.length > 0 && typeof data.temas_generales[0] === 'object') {
          temaGen = (data.temas_generales[0] as any).nombre;
          temaSlugLocal = (data.temas_generales[0] as any).slug;
        } else if (data.temas_generales && typeof data.temas_generales === 'object') {
          temaGen = (data.temas_generales as any).nombre;
          temaSlugLocal = (data.temas_generales as any).slug;
        }
        setTemaGeneral(temaGen || null);
        setTemaSlug(temaSlugLocal || null);
        // Subtemas del tema general (ordenados)
        let subtemas = [];
        if (Array.isArray(data.temas_generales)) {
          subtemas = (data.temas_generales[0] as any)?.subtemas || [];
        } else if (data.temas_generales && typeof data.temas_generales === 'object') {
          subtemas = (data.temas_generales as any).subtemas || [];
        }
        subtemas = subtemas.sort((a: any, b: any) => a.orden - b.orden);
        setSubtemasTema(subtemas);
        // Subtema actual
        setSubtemaActual(data);
        // Calcular anterior y siguiente
        const idx = subtemas.findIndex((s: any) => s.slug === subtemaSlug);
        setSubtemaAnterior(idx > 0 ? subtemas[idx - 1] : null);
        setSubtemaSiguiente(idx < subtemas.length - 1 ? subtemas[idx + 1] : null);
        console.log("Subtema encontrado:", data.id);
      } else {
        setSubtemaId(null);
        setTemaGeneral(null);
        setTemaSlug(null);
        setSubtemasTema([]);
        setSubtemaActual(null);
        setSubtemaAnterior(null);
        setSubtemaSiguiente(null);
        console.log("No se encontró subtema para el slug:", subtemaSlug);
      }
    };
    fetchSubtemaId();
  }, [subtemaSlug]);

  // Protección de sesión
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        setLoading(false);
      }
    });
  }, [router]);

  // Persistencia de completado en localStorage
  const completadoKey = subtemaSlug ? `subtema_completado_${subtemaSlug}` : undefined;
  const yaEstabaCompletadoRef = useRef(false);
  useEffect(() => {
    if (completadoKey && typeof window !== "undefined") {
      const ya = localStorage.getItem(completadoKey);
      yaEstabaCompletadoRef.current = ya === "1";
    }
  }, [completadoKey]);

  // Actualizar el progreso al entrar a un subtema y obtener el estado
  useEffect(() => {
    const actualizarYObtenerProgreso = async () => {
      if (!user || !subtemaId) {
        console.log("Esperando user o subtemaId...", user, subtemaId);
        return;
      }
      
      console.log("Consultando progreso para user_id:", user.id, "subtema_id:", subtemaId);
      
      try {
        const { data, error } = await supabase
          .from('progreso_subtemas')
          .select('id, estado')
          .eq('user_id', user.id)
          .eq('subtema_id', subtemaId)
          .single();
        
        console.log("Respuesta de progreso_subtemas:", { data, error });
        
        if (error) {
          console.error("Error buscando progreso:", error);
          
          // Si es un error 406, puede ser un problema de permisos o estructura
          if (error.code === '406') {
            console.error("Error 406 - Posible problema de permisos o estructura de tabla");
            // Intentar crear el registro directamente
            try {
              const { data: insertData, error: insertError } = await supabase
                .from('progreso_subtemas')
                .insert([
                  {
                    user_id: user.id,
                    subtema_id: subtemaId,
                    estado: 'en_progreso'
                  }
                ])
                .select();
              
              console.log("Resultado del insert directo:", { insertData, insertError });
              
              if (!insertError && insertData) {
                setEstado('en_progreso');
                console.log("Progreso creado exitosamente");
              } else {
                console.error("Error en insert directo:", insertError);
                setEstado('no_completado');
              }
            } catch (insertErr) {
              console.error("Excepción en insert:", insertErr);
              setEstado('no_completado');
            }
            return;
          }
          
          // Para otros errores, intentar crear el registro
          if (error.code === 'PGRST116') { // No rows returned
            console.log("No se encontró progreso, creando nuevo registro...");
            const { data: insertData, error: insertError } = await supabase
              .from('progreso_subtemas')
              .insert([
                {
                  user_id: user.id,
                  subtema_id: subtemaId,
                  estado: 'en_progreso'
                }
              ])
              .select();
            
            console.log("Resultado del insert:", { insertData, insertError });
            
            if (!insertError && insertData) {
              setEstado('en_progreso');
              console.log("Progreso creado como en_progreso");
            } else {
              console.error("Error creando progreso:", insertError);
              setEstado('no_completado');
            }
          } else {
            setEstado('no_completado');
          }
        } else if (!data) {
          console.log("No se encontró progreso, creando nuevo registro...");
          const { data: insertData, error: insertError } = await supabase
            .from('progreso_subtemas')
            .insert([
              {
                user_id: user.id,
                subtema_id: subtemaId,
                estado: 'en_progreso'
              }
            ])
            .select();
          
          console.log("Resultado del insert:", { insertData, insertError });
          
          if (!insertError && insertData) {
            setEstado('en_progreso');
            console.log("Progreso creado como en_progreso");
          } else {
            console.error("Error creando progreso:", insertError);
            setEstado('no_completado');
          }
        } else if (data.estado === 'no_completado') {
          console.log("Actualizando estado de no_completado a en_progreso...");
          const { error: updateError } = await supabase
            .from('progreso_subtemas')
            .update({ estado: 'en_progreso' })
            .eq('id', data.id);
          
          if (!updateError) {
            setEstado('en_progreso');
            console.log("Progreso actualizado a en_progreso");
          } else {
            console.error("Error actualizando progreso:", updateError);
            setEstado(data.estado);
          }
        } else {
          setEstado(data.estado);
          console.log("Estado encontrado:", data.estado);
          if (data && data.estado === 'completado' && completadoKey && typeof window !== "undefined") {
            localStorage.setItem(completadoKey, "1");
          }
          if (data && data.estado === 'completado') {
            yaEstabaCompletadoRef.current = true;
          }
        }
      } catch (err) {
        console.error("Excepción en actualizarYObtenerProgreso:", err);
        setEstado('no_completado');
      }
    };
    actualizarYObtenerProgreso();
  }, [user, subtemaId, completadoKey]);

  useEffect(() => {
    if (!subtemaSlug) return;
    import(`../../preguntas/${subtemaSlug}.ts`)
      .then((mod) => setPreguntas(mod.default))
      .catch(() => setPreguntas(null));
  }, [subtemaSlug]);

  // Función para marcar el subtema como completado
  const marcarComoCompletado = async () => {
    if (!user || !subtemaId) return;
    await supabase
      .from('progreso_subtemas')
      .update({ estado: 'completado' })
      .eq('user_id', user.id)
      .eq('subtema_id', subtemaId);
    setEstado('completado');
  };

  // Mejorar la lógica del sonido para que solo se reproduzca cuando el estado cambie realmente a 'completado'
  const prevEstado = useRef<string | null>(null);
  useEffect(() => {
    // Solo reproducir el audio si el usuario acaba de completar el subtema en esta sesión
    if (estado === "completado" && prevEstado.current !== "completado" && !sonidoReproducido && audioRef.current && !yaEstabaCompletadoRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setSonidoReproducido(true);
      if (completadoKey && typeof window !== "undefined") {
        localStorage.setItem(completadoKey, "1");
        yaEstabaCompletadoRef.current = true;
      }
    }
    if (estado !== "completado" && sonidoReproducido) {
      setSonidoReproducido(false);
    }
    prevEstado.current = estado;
  }, [estado, completadoKey]);

  if (loading) return <div>Cargando...</div>;

  // Mostrar el estado en pantalla
  return (
    <div>
      <audio ref={audioRef} src="/success.mp3" preload="auto" />
      <h3 className="fixed gap-x-2 h-20 w-full flex justify-start items-center top-0 mb-24 -mt-2 text-sm font-bold tracking-wider uppercase text-transform text-white/7 bg-[#13111C] z-10 m-0 left-0 md:left-auto pl-4 md:-ml-4"><a className="text-yellow-300 transition hover:contrast-125 hover:scale-105" href="/"><svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 transition" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 8l-4 4l4 4"></path><path d="M16 12h-8"></path><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path></svg></a><span className="text-white">{temaGeneral || 'TEMA GENERAL'}</span>
      </h3>
      <AnimatePresence mode="wait">
        <motion.article
          key={subtemaSlug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="block min-h-screen md:pt-20"
        >
          <div className="min-h-screen">
            {children}
            {preguntas && <ExamenInteractivo preguntas={preguntas} onComplete={marcarComoCompletado} subtemaSlug={subtemaSlug} />}
          </div>
          <footer className="flex flex-col justify-between pt-8 mt-8 border-t border-white/10">
            <span className="flex items-center gap-x-2">
              {estado === 'completado' ? (
                <>
                  <svg className="w-6 h-6 text-green-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path><path d="M9 12l2 2l4 -4"></path></svg>
                  <span className="text-green-400">Completado</span>
                </>
              ) : estado === 'en_progreso' ? (
                <>
                  <svg className="w-6 h-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path><path d="M12 8v4l3 3"></path></svg>
                  <span className="text-yellow-400">En progreso</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path><path d="M12 8v4l3 3"></path></svg>
                  <span className="text-gray-400">No completado</span>
                </>
              )}
            </span>
            <nav className="flex flex-wrap w-full gap-6 pt-12">
              {subtemaAnterior && (
                <Link className="mr-auto group" href={`/clase/${temaSlug}/${subtemaAnterior.slug}`}>
                  <div className="mr-6">
                    <div className="text-xs tracking-widest uppercase text-medium">Anterior clase</div>
                    <div className="flex items-center -mr-5 font-semibold transition group-hover:text-yellow-300 group-hover:underline gap-x-1">
                      <svg className="w-4 h-4 mt-0.5" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> {subtemaAnterior.nombre}</div></div></Link>
              )}
              {subtemaSiguiente && (
                estado === "completado" ? (
                  <MotionLink
                    className="p-4 ml-auto transition border rounded-lg border-white/20 hover:bg-black/80 group text-right"
                    href={`/clase/${temaSlug}/${subtemaSiguiente.slug}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <div className="text-xs tracking-widest uppercase text-medium">Siguiente clase</div>
                    <div className="flex items-center -mr-1 font-semibold transition group-hover:text-yellow-300 group-hover:underline gap-x-1">{subtemaSiguiente.nombre}
                      <svg className="w-4 h-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 6l6 6l-6 6"></path></svg>
                    </div>
                  </MotionLink>
                ) : (
                  <div className="p-4 ml-auto border rounded-lg border-white/20 bg-gray-800/60 opacity-60 cursor-not-allowed select-none" title="Debes completar este subtema para avanzar">
                    <div className="text-right">
                      <div className="text-xs tracking-widest uppercase text-medium">Siguiente clase</div>
                      <div className="flex items-center -mr-1 font-semibold gap-x-1 text-gray-400">
                        {subtemaSiguiente.nombre}
                        <svg className="w-4 h-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 6l6 6l-6 6"></path></svg>
                      </div>
                    </div>
                  </div>
                )
              )}
            </nav>
          </footer>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}