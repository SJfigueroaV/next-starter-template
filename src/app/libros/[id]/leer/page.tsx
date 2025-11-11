import { createClient } from "@/supabaseServer";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import VisorPDFClient from "./VisorPDFClient";

export default async function LeerLibroPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { userId?: string; tempAccess?: string };
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

  // Intentar obtener la sesión primero (más confiable que getUser en algunos casos)
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  console.log('🔍 Verificando autenticación en /libros/[id]/leer');
  console.log('Session:', session ? 'existe' : 'null');
  console.log('Session error:', sessionError);
  
  // Si no hay sesión, intentar getUser como fallback
  let user = session?.user ?? null;
  let authError = sessionError;
  
  if (!user) {
    const { data: { user: userData }, error: userError } = await supabase.auth.getUser();
    user = userData;
    authError = userError;
    console.log('Usuario (getUser):', user ? user.id : 'null');
    console.log('Error de auth (getUser):', authError);
  } else {
    console.log('Usuario (session):', user.id);
  }

  // Si no hay usuario autenticado, pero tenemos userId en la URL con tempAccess,
  // verificar la compra usando service_role (para casos donde las cookies se pierden temporalmente)
  let userIdParaVerificar = user?.id;
  let usarServiceRole = false;

  if (!user && searchParams.userId && searchParams.tempAccess === 'true') {
    console.log('🔄 Acceso temporal: verificando compra con service_role para userId:', searchParams.userId);
    userIdParaVerificar = searchParams.userId;
    usarServiceRole = true;
  }

  if (!userIdParaVerificar) {
    console.log('❌ No hay usuario, redirigiendo a /');
    // Redirigir al inicio para que inicie sesión con Google
    redirect("/");
  }

  // Verificar que el usuario ha comprado el libro
  let compra = null;
  let compraError = null;

  if (usarServiceRole) {
    // Usar service_role para verificar la compra sin necesidad de autenticación
    const { createServiceRoleClient } = await import('@/lib/supabaseServiceRole');
    const supabaseService = createServiceRoleClient();
    
    // Verificar que la compra existe y es reciente (últimos 10 minutos)
    const hace10Minutos = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    const { data: compraData, error: compraErrorData } = await supabaseService
      .from("compras_libros")
      .select("id, created_at")
      .eq("user_id", userIdParaVerificar)
      .eq("libro_id", libroId)
      .eq("estado_pago", "completado")
      .gte("created_at", hace10Minutos) // Solo compras recientes (últimos 10 minutos)
      .single();

    compra = compraData;
    compraError = compraErrorData;

    if (compra) {
      console.log('✅ Compra verificada con acceso temporal (service_role)');
    } else {
      console.log('⚠️ No se encontró compra reciente para acceso temporal');
    }
  } else {
    // Verificación normal con el usuario autenticado
    const { data: compraData, error: compraErrorData } = await supabase
      .from("compras_libros")
      .select("id")
      .eq("user_id", userIdParaVerificar)
      .eq("libro_id", libroId)
      .eq("estado_pago", "completado")
      .single();

    compra = compraData;
    compraError = compraErrorData;
  }

  // Manejar errores específicos
  if (compraError) {
    // Si es un error 406 (RLS), tratarlo como "no comprado" y redirigir
    if (compraError.status === 406 || compraError.message?.includes('406')) {
      console.warn('⚠️ Error 406 al verificar compra (problema RLS) - redirigiendo a detalle');
      redirect(`/libros/${params.id}`);
    }
    // Si es "no rows found" (PGRST116), también redirigir
    if (compraError.code === 'PGRST116') {
      console.log('ℹ️ No se encontró compra - redirigiendo a detalle');
      redirect(`/libros/${params.id}`);
    }
    // Para otros errores, también redirigir por seguridad
    console.error('Error al verificar compra:', compraError);
    console.error('Usuario:', user.id, 'Libro ID:', libroId);
    redirect(`/libros/${params.id}`);
  }

  // Si no hay compra, redirigir
  if (!compra) {
    console.log('ℹ️ No se encontró compra - redirigiendo a detalle');
    redirect(`/libros/${params.id}`);
  }

  if (!libro.archivo_pdf_url) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Este libro no tiene archivo disponible aún.</p>
          <Link href={`/libros/${params.id}`} className="text-blue-400 hover:underline">
            Volver al detalle del libro
          </Link>
        </div>
      </div>
    );
  }

  // Si el PDF está en Supabase Storage, generar una URL firmada
  let pdfUrl = libro.archivo_pdf_url;
  
  // Detectar si es una URL de Supabase Storage o una ruta relativa
  const isSupabaseStorage = 
    (libro.archivo_pdf_url.includes('supabase.co/storage/v1/object') && 
     !libro.archivo_pdf_url.includes('/public/')) ||
    libro.archivo_pdf_url.startsWith('libros-pdfs/') ||
    (libro.archivo_pdf_url.includes('/libros-pdfs/') && !libro.archivo_pdf_url.startsWith('http'));
  
  if (isSupabaseStorage) {
    // Si la URL ya es una signed URL, usarla directamente
    if (libro.archivo_pdf_url.includes('/sign/')) {
      pdfUrl = libro.archivo_pdf_url;
    } else {
      // Intentar extraer bucket y ruta de diferentes formatos
      let filePath = '';
      let bucketName = 'libros-pdfs'; // Nombre por defecto del bucket
      
      // Caso 1: URL completa de Supabase Storage
      const storageMatch = libro.archivo_pdf_url.match(/storage\/v1\/object\/(?:sign|public)\/([^\/]+)\/(.+)/);
      if (storageMatch) {
        bucketName = storageMatch[1];
        filePath = storageMatch[2];
      } 
      // Caso 2: Ruta relativa que empieza con libros-pdfs/
      else if (libro.archivo_pdf_url.startsWith('libros-pdfs/')) {
        filePath = libro.archivo_pdf_url.replace(/^libros-pdfs\//, '');
      }
      // Caso 3: Ruta relativa que contiene /libros-pdfs/
      else if (libro.archivo_pdf_url.includes('/libros-pdfs/')) {
        filePath = libro.archivo_pdf_url.split('/libros-pdfs/')[1];
      }
      // Caso 4: Solo el nombre del archivo (asumir que está en la raíz del bucket)
      else if (!libro.archivo_pdf_url.includes('/') && !libro.archivo_pdf_url.startsWith('http')) {
        filePath = libro.archivo_pdf_url;
      }
      // Caso 5: Asumir que es la ruta completa relativa al bucket
      else {
        filePath = libro.archivo_pdf_url;
      }
      
      // Generar URL firmada válida por 1 hora (3600 segundos)
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from(bucketName)
        .createSignedUrl(filePath, 3600);
      
      if (!signedUrlError && signedUrlData?.signedUrl) {
        pdfUrl = signedUrlData.signedUrl;
      } else {
        console.error('Error al generar URL firmada:', signedUrlError);
        console.error('Bucket:', bucketName, 'Ruta:', filePath);
        // Si falla, usar la URL original
      }
    }
  }

  return <VisorPDFClient libro={{ ...libro, archivo_pdf_url: pdfUrl }} />;
}

