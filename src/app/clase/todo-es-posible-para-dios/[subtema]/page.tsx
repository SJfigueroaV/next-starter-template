"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import BuscandoEnLaOscuridad from "@/app/subtemas/buscando-en-la-oscuridad";

export default function SubtemaPage() {
  const params = useParams();
  const subtemaSlug = params.subtema;
  const [subtema, setSubtema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubtema = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("subtemas")
        .select("id, nombre, descripcion")
        .eq("slug", subtemaSlug)
        .single();
      if (error) {
        setError("No se pudo cargar el subtema.");
        setSubtema(null);
      } else {
        setSubtema(data);
      }
      setLoading(false);
    };
    if (subtemaSlug) fetchSubtema();
  }, [subtemaSlug]);

  if (loading) return <div>Cargando contenido...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!subtema) return <div>No se encontró el subtema.</div>;

  if (subtemaSlug === "buscando-en-la-oscuridad") {
    // Renderiza el contenido especial para este subtema
    return (
      <BuscandoEnLaOscuridad />
    );
  }
  if (subtemaSlug === "el-hombre-caido-alejado-de-dios") {
    // Renderiza el contenido especial para este subtema
    return (
      <div style={{ background: "#222", minHeight: "100vh", padding: "2rem" }}>
        <h1 style={{ color: "#FFD700", fontSize: "2.5rem" }}>
          El hombre alejado de Dios
        </h1>
        <p style={{ color: "#FFF", fontSize: "1.2rem" }}>
          Aquí puedes personalizar el contenido, los colores, imágenes, y todo lo que quieras solo para este subtema.
        </p>
        {/* Aquí puedes poner tu examen interactivo u otros componentes */}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{subtema.nombre}</h1>
      <p className="text-lg text-gray-200 mb-4">{subtema.descripcion}</p>
      {/* Aquí puedes agregar más contenido específico del subtema */}
    </div>
  );
}