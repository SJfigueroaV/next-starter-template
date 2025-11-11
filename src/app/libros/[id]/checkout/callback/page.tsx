import { createClient } from "@/supabaseServer";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import CallbackClient from "./CallbackClient";

export default async function CallbackPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { 
    id?: string; 
    status?: string; 
    transaction_id?: string;
    user_id?: string;
    libro_id?: string;
    reference?: string;
  };
}) {
  const supabase = await createClient();
  
  // Verificar que el libro existe
  const libroId = parseInt(params.id, 10);
  
  if (isNaN(libroId)) {
    notFound();
  }

  const { data: libro } = await supabase
    .from("libros")
    .select("id")
    .eq("id", libroId)
    .single();

  if (!libro) {
    notFound();
  }

  // Verificar que el usuario está autenticado
  // Intentar primero con getSession() que es más confiable
  const { data: { session } } = await supabase.auth.getSession();
  let user = session?.user;

  // Si no hay sesión, intentar getUser() como fallback
  if (!user) {
    const { data: { user: userData } } = await supabase.auth.getUser();
    user = userData ?? undefined;
  }

  // Si aún no hay usuario, pero tenemos userId en la URL, podemos continuar
  // El callback verificará la autenticación antes de registrar la compra
  const userIdFromUrl = searchParams.user_id;
  
  if (!user && !userIdFromUrl) {
    console.warn('⚠️ No se encontró usuario autenticado ni userId en URL');
    redirect(`/libros/${params.id}`);
  }
  
  // Usar el userId de la URL si no hay usuario autenticado (pero verificar en el callback)
  const finalUserId = user?.id || userIdFromUrl;
  
  if (!finalUserId) {
    redirect(`/libros/${params.id}`);
  }

  // Obtener el ID de la transacción de los query params
  // Wompi puede enviar el ID como 'id' o 'transaction_id'
  const transactionId = searchParams.id || searchParams.transaction_id;
  const status = searchParams.status;
  
  // También obtener los metadatos que enviamos en la URL de redirección
  const libroIdFromUrl = searchParams.libro_id;
  const reference = searchParams.reference;
  
  // Verificar que los metadatos coincidan (seguridad)
  if (libroIdFromUrl && parseInt(libroIdFromUrl) !== libroId) {
    console.warn('⚠️ libro_id en URL no coincide con el parámetro de ruta');
  }
  
  if (userIdFromUrl && user && userIdFromUrl !== user.id) {
    console.warn('⚠️ user_id en URL no coincide con el usuario autenticado');
  }
  
  console.log('📋 Parámetros recibidos del callback:', { 
    transactionId, 
    status, 
    libroId, 
    userId: finalUserId,
    reference 
  });

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Verificando pago...</p>
        </div>
      </div>
    }>
      <CallbackClient 
        libroId={libroId} 
        userId={finalUserId} 
        transactionId={transactionId}
        status={status}
        reference={reference}
      />
    </Suspense>
  );
}

