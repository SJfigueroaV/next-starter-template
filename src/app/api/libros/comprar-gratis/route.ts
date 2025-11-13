import { NextResponse } from 'next/server';
import { createClient } from '@/supabaseServer';
import { createServiceRoleClient } from '@/lib/supabaseServiceRole';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { libroId: number };
    const { libroId } = body;

    if (!libroId) {
      return NextResponse.json(
        { error: 'libroId es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario está autenticado
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    let user = session?.user ?? undefined;

    if (!user) {
      const { data: { user: userData }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error al obtener usuario:', userError);
        return NextResponse.json(
          { error: 'No autorizado - error al verificar autenticación' },
          { status: 401 }
        );
      }
      user = userData ?? undefined;
    }

    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener información del libro
    const { data: libro, error: libroError } = await supabase
      .from('libros')
      .select('id, titulo, precio, archivo_pdf_url')
      .eq('id', libroId)
      .single();

    if (libroError || !libro) {
      return NextResponse.json(
        { error: 'Libro no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el precio sea 0
    if (libro.precio !== 0 && libro.precio !== null && libro.precio !== undefined) {
      return NextResponse.json(
        { error: 'Este libro no es gratuito' },
        { status: 400 }
      );
    }

    // Verificar que el libro tenga PDF disponible
    if (!libro.archivo_pdf_url) {
      return NextResponse.json(
        { error: 'Este libro aún no tiene PDF disponible. Estará disponible próximamente.' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya compró el libro
    const { data: compraExistente } = await supabase
      .from('compras_libros')
      .select('id')
      .eq('user_id', user.id)
      .eq('libro_id', libroId)
      .eq('estado_pago', 'completado')
      .single();

    if (compraExistente) {
      return NextResponse.json(
        { error: 'Ya has obtenido este libro' },
        { status: 400 }
      );
    }

    // Usar service role client para poder insertar compras sin restricciones RLS
    const supabaseService = createServiceRoleClient();

    // Registrar la compra gratuita
    const { data: nuevaCompra, error: compraError } = await supabaseService
      .from('compras_libros')
      .upsert({
        user_id: user.id,
        libro_id: libroId,
        estado_pago: 'completado',
        monto_pagado: '0.00',
        metodo_pago: 'gratis',
        transaccion_id: `GRATIS_${libroId}_${user.id}_${Date.now()}`,
      }, {
        onConflict: 'user_id,libro_id'
      })
      .select()
      .single();

    if (compraError) {
      console.error('❌ Error al registrar la compra gratuita:', compraError);
      return NextResponse.json(
        { error: 'Error al registrar la compra en la base de datos' },
        { status: 500 }
      );
    }

    console.log('✅ Compra gratuita registrada exitosamente:', nuevaCompra.id);

    return NextResponse.json({
      success: true,
      message: 'Libro obtenido exitosamente',
      compraId: nuevaCompra.id,
    });
  } catch (error: any) {
    console.error('Error al procesar compra gratuita:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la compra' },
      { status: 500 }
    );
  }
}

