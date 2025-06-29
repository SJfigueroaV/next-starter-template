"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter, useParams } from "next/navigation";

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

  // Actualizar el progreso al entrar a un subtema y obtener el estado
  useEffect(() => {
    const actualizarYObtenerProgreso = async () => {
      if (!user || !subtemaId) {
        console.log("Esperando user o subtemaId...", user, subtemaId);
        return;
      }
      const { data, error } = await supabase
        .from('progreso_subtemas')
        .select('id, estado')
        .eq('user_id', user.id)
        .eq('subtema_id', subtemaId)
        .single();
      if (error) console.log("Error buscando progreso:", error);
      if (!data) {
        await supabase.from('progreso_subtemas').insert([
          {
            user_id: user.id,
            subtema_id: subtemaId,
            estado: 'en_progreso'
          }
        ]);
        setEstado('en_progreso');
        console.log("Progreso creado como en_progreso");
      } else if (data.estado === 'no_completado') {
        await supabase
          .from('progreso_subtemas')
          .update({ estado: 'en_progreso' })
          .eq('id', data.id);
        setEstado('en_progreso');
        console.log("Progreso actualizado a en_progreso");
      } else {
        setEstado(data.estado);
        console.log("Estado encontrado:", data.estado);
      }
    };
    actualizarYObtenerProgreso();
  }, [user, subtemaId]);

  if (loading) return <div>Cargando...</div>;

  // Mostrar el estado en pantalla
  return (
    <div>
      <h3 className="fixed gap-x-2 h-20 w-full flex justify-start items-center top-0 mb-24 -mt-2 text-sm font-bold tracking-wider uppercase text-transform text-white/7 bg-[#13111C] z-10 m-0 left-0 md:left-auto pl-4 md:-ml-4"><a className="text-yellow-300 transition hover:contrast-125 hover:scale-105" href="/"><svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 transition" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 8l-4 4l4 4"></path><path d="M16 12h-8"></path><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path></svg></a><span className="text-white">{temaGeneral || 'TEMA GENERAL'}</span>
      </h3>
      <article className="block min-h-screen md:pt-20">
        <div className="min-h-screen">
          {children}
        </div>
        <footer className="flex flex-col justify-between pt-8 mt-8 border-t border-white/10">
          <span className="flex items-center gap-x-2">
            <svg className="w-6 h-6 text-green-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path><path d="M9 12l2 2l4 -4"></path></svg>
            <span className="text-green-400">Completado</span>
          </span>
          <nav className="flex flex-wrap w-full gap-6 pt-12">
            {subtemaAnterior && (
              <a className="mr-auto group" href={`/clase/${temaSlug}/${subtemaAnterior.slug}`}>
                <div className="mr-6">
                  <div className="text-xs tracking-widest uppercase text-medium">Anterior clase</div>
                  <div className="flex items-center -mr-5 font-semibold transition group-hover:text-yellow-300 group-hover:underline gap-x-1">
                    <svg className="w-4 h-4 mt-0.5" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg> {subtemaAnterior.nombre}</div></div></a>
            )}
            {subtemaSiguiente && (
              <a className="p-4 ml-auto transition border rounded-lg border-white/20 hover:bg-black/80 group" href={`/clase/${temaSlug}/${subtemaSiguiente.slug}`}>
                <div className="text-right">
                  <div className="text-xs tracking-widest uppercase text-medium">Siguiente clase</div>
                  <div className="flex items-center -mr-1 font-semibold transition group-hover:text-yellow-300 group-hover:underline gap-x-1">{subtemaSiguiente.nombre}
                    <svg className="w-4 h-4 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 6l6 6l-6 6"></path></svg></div></div></a>
            )}
          </nav>
        </footer>
      </article>
    </div>
  );
}