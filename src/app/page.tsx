import { supabase } from "@/supabaseClient";
import HomeClient from "./HomeClient"; // crea este archivo abajo

export default async function Home() {
  const { data: temasGenerales } = await supabase
    .from("temas_generales")
    .select(`*, subtemas(*)`);

  return (
    <main>
      <HomeClient temasGenerales={temasGenerales} />
    </main>
  );
}
