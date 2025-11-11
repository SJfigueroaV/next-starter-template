import { createClient } from "@/supabaseServer";
import { notFound, redirect } from "next/navigation";
import LibroDetalleClient from "./LibroDetalleClient";

export default async function LibroDetallePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  
  // Verificar que el libro existe
  // Convertir params.id a número para la comparación con BIGINT
  const libroId = parseInt(params.id, 10);
  
  if (isNaN(libroId)) {
    notFound();
  }

  const { data: libro, error: libroError } = await supabase
    .from("libros")
    .select("*")
    .eq("id", libroId)
    .single();

  if (libroError || !libro) {
    notFound();
  }

  // Verificar si el usuario está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si el usuario está autenticado, verificar si ya compró el libro
  let estaComprado = false;
  if (user) {
    const { data: compra } = await supabase
      .from("compras_libros")
      .select("id")
      .eq("user_id", user.id)
      .eq("libro_id", libroId)
      .eq("estado_pago", "completado")
      .single();

    estaComprado = !!compra;
  }

  return <LibroDetalleClient libro={libro} estaComprado={estaComprado} user={user} />;
}

