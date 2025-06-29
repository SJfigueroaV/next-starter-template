"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useRouter, useParams } from "next/navigation";

export default function ClaseLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [subtemaId, setSubtemaId] = useState<string | null>(null);
  const [estado, setEstado] = useState<string | null>(null); // <--- Nuevo estado
  const router = useRouter();
  const params = useParams();

  const subtemaSlug = params.subtema as string;

  // Obtener el uuid del subtema por el slug
  useEffect(() => {
    const fetchSubtemaId = async () => {
      if (!subtemaSlug) return;
      const { data } = await supabase
        .from('subtemas')
        .select('uuid')
        .eq('slug', subtemaSlug)
        .single();
      if (data) {
        setSubtemaId(data.uuid);
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
        setLoading(false);
      }
    });
  }, [router]);

  // Actualizar el progreso al entrar a un subtema y obtener el estado
  useEffect(() => {
    const actualizarYObtenerProgreso = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !subtemaId) return;
      const { data } = await supabase
        .from('progreso_subtemas')
        .select('id, estado')
        .eq('user_id', user.id)
        .eq('subtema_id', subtemaId)
        .single();
      if (!data) {
        await supabase.from('progreso_subtemas').insert([
          {
            user_id: user.id,
            subtema_id: subtemaId,
            estado: 'en_progreso'
          }
        ]);
        setEstado('en_progreso');
      } else if (data.estado === 'no_completado') {
        await supabase
          .from('progreso_subtemas')
          .update({ estado: 'en_progreso' })
          .eq('id', data.id);
        setEstado('en_progreso');
      } else {
        setEstado(data.estado);
      }
    };
    actualizarYObtenerProgreso();
  }, [subtemaId]);

  if (loading) return <div>Cargando...</div>;

  // Mostrar el estado en pantalla
  return (
    <div>
      <h1>PRUEBA DE LAYOUT</h1>
      <div>
        Estado del subtema:{" "}
        {estado === "completado" && <span style={{ color: "limegreen" }}>✔ Completado</span>}
        {estado === "en_progreso" && <span style={{ color: "orange" }}>⏳ En progreso</span>}
        {estado === "no_completado" && <span style={{ color: "red" }}>✖ No completado</span>}
        {!estado && <span>Cargando estado...</span>}
      </div>
      {children}
    </div>
  );
}