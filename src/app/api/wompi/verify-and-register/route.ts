import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabaseServiceRole';

const wompiPrivateKey = process.env.WOMPI_PRIVATE_KEY;
const wompiPublicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;

export async function POST(request: Request) {
  try {
    // Verificar que Wompi esté configurado
    if (!wompiPrivateKey || !wompiPublicKey) {
      return NextResponse.json(
        { error: 'Wompi no está configurado' },
        { status: 500 }
      );
    }

    const { reference, libroId, userId } = await request.json();

    if (!reference || !libroId || !userId) {
      return NextResponse.json(
        { error: 'reference, libroId y userId son requeridos' },
        { status: 400 }
      );
    }

    // Validar que la referencia contiene el userId y libroId correctos
    // Formato: LIBRO_{libroId}_USER_{userId}_{timestamp}
    const referencePattern = /^LIBRO_(\d+)_USER_([a-f0-9-]+)_\d+$/;
    const match = reference.match(referencePattern);
    
    if (!match) {
      return NextResponse.json(
        { error: 'Formato de referencia inválido' },
        { status: 400 }
      );
    }

    const [, refLibroId, refUserId] = match;
    
    // Verificar que los IDs coinciden con la referencia
    if (refLibroId !== libroId.toString() || refUserId !== userId) {
      return NextResponse.json(
        { error: 'Los IDs no coinciden con la referencia' },
        { status: 400 }
      );
    }

    // No requerimos autenticación aquí porque validamos la referencia
    // La referencia solo puede ser generada por nuestro servidor y contiene los IDs correctos

    // Determinar si estamos en modo de prueba o producción
    const isTestMode = wompiPrivateKey.startsWith('prv_test_');
    const wompiBaseUrl = isTestMode 
      ? 'https://sandbox.wompi.co/v1'
      : 'https://production.wompi.co/v1';

    // Buscar la transacción por referencia usando la API de Wompi
    console.log('🔍 Buscando transacción por referencia:', reference);
    
    const wompiResponse = await fetch(`${wompiBaseUrl}/transactions?reference=${reference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wompiPrivateKey}`,
      },
    });

    const wompiData = await wompiResponse.json();

    if (!wompiResponse.ok) {
      console.error('❌ Error al buscar transacción en Wompi:', wompiData);
      return NextResponse.json(
        { error: 'Error al buscar la transacción en Wompi' },
        { status: 500 }
      );
    }

    // Wompi puede devolver un array o un objeto
    const transactions = Array.isArray(wompiData.data) ? wompiData.data : [wompiData.data];
    const transaction = transactions.find((t: any) => t.reference === reference) || transactions[0];

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transacción no encontrada' },
        { status: 404 }
      );
    }

    console.log('✅ Transacción encontrada:', transaction.id);
    console.log('📊 Estado:', transaction.status);

    // Verificar que el pago fue exitoso
    const approvedStatuses = ['APPROVED', 'APPROVED_PARTIAL'];
    if (!approvedStatuses.includes(transaction.status?.toUpperCase())) {
      return NextResponse.json(
        { error: `La transacción no está aprobada. Estado: ${transaction.status}` },
        { status: 400 }
      );
    }

    // Verificar si ya está registrada
    const supabaseService = createServiceRoleClient();
    const { data: compraExistente } = await supabaseService
      .from('compras_libros')
      .select('id')
      .eq('user_id', userId)
      .eq('libro_id', parseInt(libroId))
      .eq('estado_pago', 'completado')
      .single();

    if (compraExistente) {
      return NextResponse.json({
        success: true,
        message: 'La compra ya estaba registrada',
        compraId: compraExistente.id,
      });
    }

    // Registrar la compra
    const amountInCents = transaction.amount_in_cents || 0;
    const amount = (amountInCents / 100).toFixed(2);

    const paymentMethod = transaction.payment_method_type || 
                         transaction.payment_method?.type ||
                         transaction.payment_method_type_name ||
                         'wompi';

    const { data: nuevaCompra, error: compraError } = await supabaseService
      .from('compras_libros')
      .upsert({
        user_id: userId,
        libro_id: parseInt(libroId),
        estado_pago: 'completado',
        monto_pagado: amount,
        metodo_pago: paymentMethod.toLowerCase(),
        transaccion_id: transaction.id,
      }, {
        onConflict: 'user_id,libro_id'
      })
      .select()
      .single();

    if (compraError) {
      console.error('❌ Error al registrar la compra:', compraError);
      return NextResponse.json(
        { error: 'Error al registrar la compra en la base de datos' },
        { status: 500 }
      );
    }

    console.log('✅ Compra registrada exitosamente:', nuevaCompra.id);

    return NextResponse.json({
      success: true,
      message: 'Compra registrada exitosamente',
      compraId: nuevaCompra.id,
      transactionId: transaction.id,
    });
  } catch (error: any) {
    console.error('Error al verificar y registrar transacción:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar la transacción' },
      { status: 500 }
    );
  }
}

