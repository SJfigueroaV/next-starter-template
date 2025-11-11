import { createClient } from "@/supabaseServer";
import LibrosClient from "./LibrosClient";

export default async function LibrosPage() {
  const supabase = await createClient();
  
  // Obtener todos los libros disponibles
  const { data: libros, error } = await supabase
    .from("libros")
    .select("id, titulo, autor, descripcion, precio, portada_url, archivo_pdf_url, categoria, fecha_publicacion")
    .order("fecha_publicacion", { ascending: false });

  if (error) {
    console.error('Error al obtener libros:', error);
  }

  // Obtener el usuario en el servidor para pasarlo al cliente
  // Esto evita problemas de sincronización después del login
  // Intentar primero con getSession() que es más confiable para leer cookies
  const { data: { session } } = await supabase.auth.getSession();
  let user = session?.user ?? null;
  
  // Si no hay sesión, intentar con getUser() como fallback
  if (!user) {
    const { data: { user: userData } } = await supabase.auth.getUser();
    if (userData) {
      console.log('✅ Usuario encontrado con getUser() en /libros');
      user = userData;
    } else {
      console.warn('⚠️ No se encontró usuario en /libros - cookies presentes pero sin sesión');
    }
  } else {
    console.log('✅ Usuario encontrado con getSession() en /libros:', user.email);
  }

  // Obtener categorías únicas
  const categorias = libros
    ? [...new Set(libros.map((libro: any) => libro.categoria).filter(Boolean))]
    : [];

  return (
    <main className="w-full">
      <LibrosClient libros={libros || []} categorias={categorias} error={error} initialUser={user} />
    </main>
  );
}

