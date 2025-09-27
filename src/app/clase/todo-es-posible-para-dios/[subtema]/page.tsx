"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import BuscandoEnLaOscuridad from "@/app/subtemas/buscando-en-la-oscuridad";
import Introduccion from "@/app/subtemas/introduccion";
import ElHombreCaidoAlejadoDeDios from "@/app/subtemas/el-hombre-caido-alejado-de-dios";
import LaPromesa from "@/app/subtemas/la-promesa";
import LlamadosAlEncuentroConCristo from "@/app/subtemas/llamados-al-encuentro-con-cristo";
import EdificadosParaSerMoradaDeDiosEnElEspiritu from "@/app/subtemas/edificados-para-ser-morada-de-dios-en-el-espiritu";
import GuiadosPorElEspirituDeDios from "@/app/subtemas/guiados-por-el-espiritu-de-dios";
import ElCaminoDeLaSantificacionCompleta from "@/app/subtemas/el-camino-de-la-santificacion-completa";
import Conclusion from "@/app/subtemas/conclusion";

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

  // Efecto especial para marcar automáticamente el subtema "conclusion" como completado
  useEffect(() => {
    const marcarConclusionComoCompletada = async () => {
      if (subtemaSlug === "conclusion" && subtema) {
        const user = (await supabase.auth.getUser()).data.user;
        if (user) {
          // Verificar si ya existe un registro de progreso
          const { data: existingProg } = await supabase
            .from("progreso_subtemas")
            .select("id, estado")
            .eq("user_id", user.id)
            .eq("subtema_id", subtema.id)
            .single();

          if (!existingProg) {
            // Si no existe, crear uno nuevo como completado
            await supabase
              .from("progreso_subtemas")
              .insert([
                {
                  user_id: user.id,
                  subtema_id: subtema.id,
                  estado: 'completado'
                }
              ]);
          } else if (existingProg.estado !== "completado") {
            // Si existe pero no está completado, actualizarlo
            await supabase
              .from("progreso_subtemas")
              .update({ estado: 'completado' })
              .eq("id", existingProg.id);
          }
        }
      }
    };

    if (subtemaSlug === "conclusion" && subtema) {
      marcarConclusionComoCompletada();
    }
  }, [subtemaSlug, subtema]);

  if (loading) return <div>Cargando contenido...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!subtema) return <div>No se encontró el subtema.</div>;
  if (bloqueado) return <div className="text-red-500 font-bold">No puedes acceder a este subtema hasta completar el anterior.</div>;

  // Componente común para mostrar el título del subtema
  const SubtemaHeader = () => (
    <div id="clase">
      <h1>{subtema.nombre}</h1>
    </div>
  );

  if (subtemaSlug === "buscando-en-la-oscuridad") {
    // Renderiza el contenido especial para este subtema
    return (
      <div>
        
        <BuscandoEnLaOscuridad />
      </div>
    );
  }
  if (subtemaSlug === "introduccion") {
    // Renderiza el contenido especial para este subtema
    return (
      <div>
        <Introduccion />
      </div>
    );
  }
  if (subtemaSlug === "el-hombre-caido-alejado-de-dios") {
    // Renderiza el contenido especial para este subtema
    return (
      <div>
       <ElHombreCaidoAlejadoDeDios/>
      </div>
    );
  }
  if (subtemaSlug === "la-promesa") {
    // Renderiza el contenido especial para este subtema
    return (
      <div>
       <LaPromesa/>
      </div>
    );
  }
  if (subtemaSlug === "llamados-al-encuentro-con-cristo") {
    // Renderiza el contenido especial para este subtema
    return (
      <div>
       <LlamadosAlEncuentroConCristo/>
      </div>
    );
  }
  if (subtemaSlug === "edificados-para-ser-morada-de-dios-en-el-espiritu") {
    // Renderiza el contenido especial para este subtema
    return (
      <div>
       <EdificadosParaSerMoradaDeDiosEnElEspiritu/>
      </div>
    );
  }
  if (subtemaSlug === "guiados-por-el-espiritu-de-dios") {
    // Renderiza el contenido especial para este subtema
    return (
      <div>
       <GuiadosPorElEspirituDeDios/>
      </div>
    );
  }
  if (subtemaSlug === "el-camino-de-la-santificacion-completa") {
    // Renderiza el contenido especial para este subtema
    return (
      <div>
       <ElCaminoDeLaSantificacionCompleta/>
      </div>
    );
  }
  if (subtemaSlug === "conclusion") {
    // Renderiza el contenido especial para este subtema
    return (
      <div>
       <Conclusion/>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{subtema.nombre}</h1>
      <p>Proximamente</p>
      {/* <p className="text-lg text-gray-200 mb-4">{subtema.descripcion}</p> */}
    </div>
  );
}