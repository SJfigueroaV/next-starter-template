import { createClient } from "@/supabaseServer";
import { notFound, redirect } from "next/navigation";
import WompiCheckoutClient from "./WompiCheckoutClient";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { payment_intent?: string };
}) {
  const supabase = await createClient();
  
  // Verificar que el libro existe
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

  // Verificar que el usuario está autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/libros/${params.id}`);
  }

  // Verificar si el usuario ya compró el libro
  const { data: compra } = await supabase
    .from("compras_libros")
    .select("id")
    .eq("user_id", user.id)
    .eq("libro_id", libroId)
    .eq("estado_pago", "completado")
    .single();

  if (compra) {
    // Si ya compró, redirigir a la página de lectura
    redirect(`/libros/${params.id}/leer`);
  }

  return <WompiCheckoutClient libro={libro} user={user} />;
}

