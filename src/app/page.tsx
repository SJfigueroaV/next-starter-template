import { supabase } from "@/supabaseClient";
import HomeClient from "./HomeClient"; // crea este archivo abajo

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
    <main>
      <HomeClient temasGenerales={temasConSubtemasOrdenados} />
    </main>
  );
}
