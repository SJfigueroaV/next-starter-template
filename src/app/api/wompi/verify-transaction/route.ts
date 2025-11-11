import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');
    const libroId = searchParams.get('libroId');
    const userId = searchParams.get('userId');

    // transactionId es opcional - podemos verificar solo con libroId y userId
    if (!libroId || !userId) {
      return NextResponse.json(
        { error: 'Faltan parámetros requeridos (libroId y userId)' },
        { status: 400 }
      );
    }

    // No requerimos autenticación aquí porque solo estamos verificando si existe la compra
    // Usamos service_role para evitar problemas con RLS cuando las cookies se pierden
    const { createServiceRoleClient } = await import('@/lib/supabaseServiceRole');
    const supabase = createServiceRoleClient();

    // Verificar si la compra fue registrada en la base de datos
    // Si tenemos transactionId, usarlo; si no, verificar solo con libroId y userId
    let query = supabase
      .from('compras_libros')
      .select('id, estado_pago, transaccion_id')
      .eq('user_id', userId)
      .eq('libro_id', parseInt(libroId))
      .eq('estado_pago', 'completado');
    
    if (transactionId) {
      query = query.eq('transaccion_id', transactionId);
    }
    
    const { data: compra, error: compraError } = await query.single();

    if (compraError || !compra) {
      // Si no está registrada, puede que el webhook aún no haya procesado
      console.log('⚠️ Compra no encontrada aún:', { 
        transactionId, 
        libroId, 
        userId,
        error: compraError?.message 
      });
      return NextResponse.json({
        completado: false,
        mensaje: 'El pago está siendo procesado. Por favor, espera unos segundos y recarga la página.',
      });
    }

    console.log('✅ Compra encontrada:', { 
      compraId: compra.id, 
      transaccionId: compra.transaccion_id 
    });
    
    return NextResponse.json({
      completado: true,
    });
  } catch (error: any) {
    console.error('Error al verificar transacción:', error);
    return NextResponse.json(
      { error: error.message || 'Error al verificar la transacción' },
      { status: 500 }
    );
  }
}

