"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter, useParams } from "next/navigation";

export default function ClaseLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [subtemaId, setSubtemaId] = useState<string | null>(null);
  const [estado, setEstado] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const params = useParams();

  const subtemaSlug = params.subtema as string;

  // Obtener el uuid del subtema por el slug
  useEffect(() => {
    console.log("subtemaSlug:", subtemaSlug); // Depuración
    const fetchSubtemaId = async () => {
      if (!subtemaSlug) return;
      const { data, error } = await supabase
        .from('subtemas')
        .select('id')
        .eq('slug', subtemaSlug)
        .single();
      console.log("Respuesta de supabase:", data, error); // Depuración
      if (error) console.log("Error buscando subtema:", error);
      if (data) {
        setSubtemaId(data.id);
        console.log("Subtema encontrado:", data.id);
      } else {
        setSubtemaId(null);
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
      <header>
        <h3 className="fixed gap-x-2 h-20 w-full flex justify-start items-center top-0 mb-24 -mt-2 text-sm font-bold tracking-wider uppercase text-transform text-white/7 bg-[#13111C] z-10 m-0 left-0 md:left-auto pl-4 md:-ml-4"><a className="text-yellow-300 transition hover:contrast-125 hover:scale-105" href="/"><svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 transition" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 8l-4 4l4 4"></path><path d="M16 12h-8"></path><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path></svg></a><span className="text-white">Introducción</span></h3>
      </header> 
      <main>
        {children}
      </main>
      <footer>
        <div>
          Estado del subtema:{" "}
          {estado === "completado" && <span style={{ color: "limegreen" }}>✔ Completado</span>}
          {estado === "en_progreso" && <span style={{ color: "orange" }}>⏳ En progreso</span>}
          {estado === "no_completado" && <span style={{ color: "red" }}>✖ No completado</span>}
          {!estado && <span>Cargando estado...</span>}
        </div>
      </footer>
    </div>
  );
}