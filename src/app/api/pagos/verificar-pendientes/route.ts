import { NextResponse } from 'next/server';
import { createClient } from '@/supabaseServer';
import { createServiceRoleClient } from '@/lib/supabaseServiceRole';

/**
 * Endpoint para verificar y procesar pagos pendientes cuando el usuario inicia sesión
 * Busca transacciones pendientes vinculadas al email del usuario y las procesa
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    const userId = session.user.id;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'No se pudo obtener el email del usuario' },
        { status: 400 }
      );
    }

    console.log('🔍 Verificando pagos pendientes para:', userEmail);

    // Usar service role para poder leer todas las transacciones pendientes
    const supabaseService = createServiceRoleClient();

    // Buscar transacciones pendientes vinculadas al email del usuario
    const { data: transaccionesPendientes, error: errorBuscar } = await supabaseService
      .from('transacciones_pendientes')
      .select('id, libro_id, reference, monto, estado, transaccion_wompi_id')
      .eq('user_email', userEmail)
      .in('estado', ['pendiente', 'procesando'])
      .order('created_at', { ascending: false });

    if (errorBuscar) {
      console.error('❌ Error al buscar transacciones pendientes:', errorBuscar);
      return NextResponse.json(
        { error: 'Error al buscar transacciones pendientes' },
        { status: 500 }
      );
    }

    if (!transaccionesPendientes || transaccionesPendientes.length === 0) {
      console.log('✅ No hay transacciones pendientes para procesar');
      return NextResponse.json({
        procesadas: 0,
        mensaje: 'No hay pagos pendientes',
      });
    }

    console.log(`📋 Encontradas ${transaccionesPendientes.length} transacciones pendientes`);

    // Verificar cada transacción pendiente con Wompi
    const wompiPrivateKey = process.env.WOMPI_PRIVATE_KEY;
    if (!wompiPrivateKey) {
      console.error('⚠️ WOMPI_PRIVATE_KEY no está configurada');
      return NextResponse.json(
        { error: 'Wompi no está configurado correctamente' },
        { status: 500 }
      );
    }

    const isTestMode = wompiPrivateKey.startsWith('prv_test_');
    const wompiBaseUrl = isTestMode 
      ? 'https://sandbox.wompi.co/v1'
      : 'https://production.wompi.co/v1';

    let procesadas = 0;
    const resultados: Array<{ reference: string; estado: string; mensaje: string }> = [];

    for (const transPendiente of transaccionesPendientes) {
      try {
        console.log(`🔍 Verificando transacción: ${transPendiente.reference}`);

        // Si ya tenemos el ID de Wompi, verificar directamente
        let transactionId = transPendiente.transaccion_wompi_id;
        
        // Si no tenemos el ID, buscar por referencia
        if (!transactionId) {
          const wompiResponse = await fetch(
            `${wompiBaseUrl}/transactions?reference=${encodeURIComponent(transPendiente.reference)}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${wompiPrivateKey}`,
              },
            }
          );

          if (wompiResponse.ok) {
            const wompiData = await wompiResponse.json() as { 
              data?: any[] | any; 
              error?: { message?: string };
            };
            
            const transactions = Array.isArray(wompiData.data) 
              ? wompiData.data 
              : (wompiData.data ? [wompiData.data] : []);
            
            const transaction = transactions.find(
              (t: any) => t.reference === transPendiente.reference
            ) || transactions[0];

            if (transaction) {
              transactionId = transaction.id;
            }
          }
        }

        // Si tenemos el ID de la transacción, verificar su estado
        if (transactionId) {
          const wompiResponse = await fetch(
            `${wompiBaseUrl}/transactions/${transactionId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${wompiPrivateKey}`,
              },
            }
          );

          if (wompiResponse.ok) {
            const transaction = await wompiResponse.json() as any;
            const status = transaction.status?.toUpperCase();

            if (status === 'APPROVED' || status === 'APPROVED_PARTIAL') {
              // Verificar si la compra ya está registrada
              const { data: compraExistente } = await supabaseService
                .from('compras_libros')
                .select('id')
                .eq('user_id', userId)
                .eq('libro_id', transPendiente.libro_id)
                .eq('estado_pago', 'completado')
                .single();

              if (!compraExistente) {
                // Registrar la compra
                const amountInCents = transaction.amount_in_cents || 0;
                const amount = (amountInCents / 100).toFixed(2);
                const paymentMethod = transaction.payment_method_type || 
                                     transaction.payment_method?.type ||
                                     'wompi';

                const { error: compraError } = await supabaseService
                  .from('compras_libros')
                  .upsert({
                    user_id: userId,
                    libro_id: transPendiente.libro_id,
                    estado_pago: 'completado',
                    monto_pagado: amount,
                    metodo_pago: paymentMethod.toLowerCase(),
                    transaccion_id: transactionId,
                  }, {
                    onConflict: 'user_id,libro_id'
                  });

                if (compraError) {
                  console.error('❌ Error al registrar compra:', compraError);
                  resultados.push({
                    reference: transPendiente.reference,
                    estado: 'error',
                    mensaje: 'Error al registrar la compra',
                  });
                  continue;
                }

                // Actualizar la transacción pendiente como completada
                await supabaseService
                  .from('transacciones_pendientes')
                  .update({
                    estado: 'completado',
                    transaccion_wompi_id: transactionId,
                    procesado_at: new Date().toISOString(),
                    user_id: userId, // Actualizar user_id si no estaba
                  })
                  .eq('id', transPendiente.id);

                procesadas++;
                resultados.push({
                  reference: transPendiente.reference,
                  estado: 'completado',
                  mensaje: 'Pago procesado exitosamente',
                });

                console.log(`✅ Compra registrada: Libro ${transPendiente.libro_id}, Transacción ${transactionId}`);
              } else {
                // Ya estaba registrada, solo actualizar la transacción pendiente
                await supabaseService
                  .from('transacciones_pendientes')
                  .update({
                    estado: 'completado',
                    transaccion_wompi_id: transactionId,
                    procesado_at: new Date().toISOString(),
                    user_id: userId,
                  })
                  .eq('id', transPendiente.id);

                resultados.push({
                  reference: transPendiente.reference,
                  estado: 'ya_registrado',
                  mensaje: 'La compra ya estaba registrada',
                });
              }
            } else {
              resultados.push({
                reference: transPendiente.reference,
                estado: 'pendiente',
                mensaje: `Transacción con estado: ${status}`,
              });
            }
          }
        } else {
          // No se encontró la transacción en Wompi, puede que aún no se haya creado
          resultados.push({
            reference: transPendiente.reference,
            estado: 'no_encontrada',
            mensaje: 'Transacción no encontrada en Wompi',
          });
        }
      } catch (error: any) {
        console.error(`❌ Error al procesar transacción ${transPendiente.reference}:`, error);
        resultados.push({
          reference: transPendiente.reference,
          estado: 'error',
          mensaje: error.message || 'Error al procesar',
        });
      }
    }

    console.log(`✅ Procesadas ${procesadas} transacciones pendientes`);

    return NextResponse.json({
      procesadas,
      total: transaccionesPendientes.length,
      resultados,
    });
  } catch (error: any) {
    console.error('❌ Error al verificar pagos pendientes:', error);
    return NextResponse.json(
      { error: error.message || 'Error al verificar pagos pendientes' },
      { status: 500 }
    );
  }
}

