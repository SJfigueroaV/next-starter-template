"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

export default function SubtemaPage() {
  const params = useParams();
  const subtemaSlug = params.subtema;
  const router = useRouter();
  const [subtema, setSubtema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bloqueado, setBloqueado] = useState(false);

  useEffect(() => {
    const fetchSubtema = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("subtemas")
        .select("id, nombre, descripcion, orden, tema_general_id")
        .eq("slug", subtemaSlug)
        .single();
      if (error) {
        setError("No se pudo cargar el subtema.");
        setSubtema(null);
        setLoading(false);
        return;
      }
      setSubtema(data);
      // Protección progresiva
      // Traer todos los subtemas del mismo tema general, ordenados
      const { data: subtemasTema } = await supabase
        .from("subtemas")
        .select("id, slug, orden")
        .eq("tema_general_id", data.tema_general_id)
        .order("orden", { ascending: true });
      if (subtemasTema && subtemasTema.length > 0) {
        const idx = subtemasTema.findIndex((s: any) => s.slug === subtemaSlug);
        if (idx > 0) {
          const anterior = subtemasTema[idx - 1];
          // Verificar progreso del subtema anterior
          const user = (await supabase.auth.getUser()).data.user;
          if (user) {
            const { data: prog } = await supabase
              .from("progreso_subtemas")
              .select("estado")
              .eq("user_id", user.id)
              .eq("subtema_id", anterior.id)
              .single();
            if (!prog || prog.estado !== "completado") {
              setBloqueado(true);
            }
          }
        }
      }
      setLoading(false);
    };
    if (subtemaSlug) fetchSubtema();
  }, [subtemaSlug]);

  if (loading) return <div>Cargando contenido...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!subtema) return <div>No se encontró el subtema.</div>;
  if (bloqueado) return <div className="text-red-500 font-bold">No puedes acceder a este subtema hasta completar el anterior.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{subtema.nombre}</h1>
      <p className="text-lg text-gray-200 mb-4">{subtema.descripcion}</p>
      {/* Aquí puedes agregar más contenido específico del subtema */}
    </div>
  );
}