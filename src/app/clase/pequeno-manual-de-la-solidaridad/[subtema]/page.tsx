"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import IntroduccionPequenoManualDeLaSolidaridad from "@/app/subtemas/introduccion-pequeno-manual-de-la-solidaridad";
import ElHombreCaido from "@/app/subtemas/el-hombre-caido";
import PrimeraActitudPersonaCaida from "@/app/subtemas/primera-actitud-ante-la-persona-caida";
import Samaritano from "@/app/subtemas/un-samaritano";
import ProcesoSolidaridadAproximarse from "@/app/subtemas/proceso-de-la-solidaridad";
import Acercarse from "@/app/subtemas/acercarse";
import Compasion from "@/app/subtemas/compasion";
import VerSolidaridad from "@/app/subtemas/ver";
import DespojarsePrivilegios from "@/app/subtemas/despojarse-de-privilegios-personales";
import PonerConocimientoServicio from "@/app/subtemas/poner-todo-el-conocimiento-al-servicio-del-otro";
import SolidaridadSeContagia from "@/app/subtemas/la-solidaridad-se-contagia";
import ApendiceSolidaridad from "@/app/subtemas/apendice";
import ConclusionFinal from "@/app/subtemas/conclusion-final";

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
  useEffect(() => {
    const marcarComoCompletada = async () => {
      if ((subtemaSlug === "conclusion-final" ) && subtema) {
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

    if ((subtemaSlug === "conclusion-final" ) && subtema) {
      marcarComoCompletada();
    }
  }, [subtemaSlug, subtema]);

  if (loading) return <div>Cargando contenido...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!subtema) return <div>No se encontró el subtema.</div>;
  if (bloqueado) return <div className="text-red-500 font-bold">No puedes acceder a este subtema hasta completar el anterior.</div>;

  if (subtemaSlug === "introduccion-pequeno-manual-de-la-solidaridad") {
    return <IntroduccionPequenoManualDeLaSolidaridad/>;
  }
  if (subtemaSlug === "el-hombre-caido") {
    return <ElHombreCaido/>;
  }
  if (subtemaSlug === "primera-actitud-ante-la-persona-caida") {
    return <PrimeraActitudPersonaCaida/>;
  }
  if (subtemaSlug === "un-samaritano") {
    return <Samaritano/>;
  }
  if (subtemaSlug === "proceso-de-la-solidaridad") {
    return <ProcesoSolidaridadAproximarse/>;
  }
  if (subtemaSlug === "acercarse") {
    return <Acercarse/>;
  }
  if (subtemaSlug === "compasion") {
    return <Compasion/>;
  }
  if (subtemaSlug === "ver") {
    return <VerSolidaridad/>;
  }
  if (subtemaSlug === "despojarse-de-privilegios-personales") {
    return <DespojarsePrivilegios/>;
  }
  if (subtemaSlug === "poner-todo-el-conocimiento-al-servicio-del-otro") {
    return <PonerConocimientoServicio/>;
  }
  if (subtemaSlug === "la-solidaridad-se-contagia") {
    return <SolidaridadSeContagia/>;
  }
  if (subtemaSlug === "apendice") {
    return <ApendiceSolidaridad/>;
  }
  if (subtemaSlug === "conclusion-final") {
    return <ConclusionFinal/>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{subtema.nombre}</h1>
      <p className="text-lg text-gray-200 mb-4">{subtema.descripcion}</p>
      {/* Aquí puedes agregar más contenido específico del subtema */}
    </div>
  );
}