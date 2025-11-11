import { supabase } from "@/supabaseClient";
import HomeClient from "./HomeClient"; // crea este archivo abajo
import { Suspense } from "react";

export default async function Home() {
  const { data: temasGenerales } = await supabase
    .from("temas_generales")
    .select(`*, subtemas(*)`);

  // Agrupa y ordena los subtemas por tema
  const temasConSubtemasOrdenados = (temasGenerales || []).map(tema => ({
    ...tema,
    subtemas: (tema.subtemas || []).sort((a: any, b: any) => a.orden - b.orden)
  }));

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Cargando...</div>}>
      <HomeClient temasGenerales={temasConSubtemasOrdenados} />
    </Suspense>
  );
}
