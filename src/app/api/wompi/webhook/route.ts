import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabaseServiceRole';
import crypto from 'crypto';

const wompiIntegritySecret = process.env.WOMPI_INTEGRITY_SECRET;

if (!wompiIntegritySecret) {
  console.error('⚠️ WOMPI_INTEGRITY_SECRET no está configurada en las variables de entorno');
}

export async function POST(request: Request) {
  try {
    if (!wompiIntegritySecret) {
      console.error('WOMPI_INTEGRITY_SECRET no está configurada');
      return NextResponse.json(
        { error: 'Wompi no está configurado correctamente' },
        { status: 500 }
      );
    }

    const body = await request.text();
    
    // Wompi puede enviar la firma en diferentes headers
    const signature = request.headers.get('x-signature') || 
                     request.headers.get('signature') ||
                     request.headers.get('wompi-signature');

    console.log('📥 Webhook recibido de Wompi');
    console.log('🔐 Firma presente:', !!signature);
    console.log('📦 Tamaño del body:', body.length);

    // Verificar la firma del webhook
    if (signature && wompiIntegritySecret) {
      const expectedSignature = crypto
        .createHmac('sha256', wompiIntegritySecret)
        .update(body)
        .digest('hex');

      // Comparar firmas (case-insensitive)
      if (signature.toLowerCase() !== expectedSignature.toLowerCase()) {
        console.error('❌ Firma del webhook inválida');
        console.error('Esperada:', expectedSignature);
        console.error('Recibida:', signature);
        return NextResponse.json(
          { error: 'Firma inválida' },
          { status: 401 }
        );
      }
      console.log('✅ Firma verificada correctamente');
    } else {
      console.warn('⚠️ No se recibió firma del webhook - continuando sin verificación');
    }

    const event = JSON.parse(body);
    console.log('📋 Tipo de evento:', event.event || event.type || 'unknown');
    console.log('📋 Datos del evento:', JSON.stringify(event, null, 2));

    // Manejar el evento de transacción actualizada
    // Wompi puede enviar el evento en diferentes formatos
    const isTransactionEvent = 
      event.event === 'transaction.updated' ||
      event.event === 'TRANSACTION.UPDATED' ||
      event.type === 'transaction.updated' ||
      event.type === 'TRANSACTION.UPDATED' ||
      event.data?.status !== undefined ||
      event.status !== undefined;

    if (isTransactionEvent) {
      // Wompi puede enviar los datos directamente o dentro de event.data
      const transaction = event.data || event;
      
      console.log('💳 Procesando transacción:', transaction.id || transaction.data?.id);
      
      // Extraer metadatos (pueden estar en diferentes lugares)
      // Con Web Checkout, los metadatos pueden no estar disponibles en el webhook
      // Intentar extraerlos de diferentes lugares
      const metadata = transaction.metadata || event.metadata || {};
      let libro_id = metadata.libro_id;
      let user_id = metadata.user_id;
      
      // Obtener la referencia de la transacción
      const reference = transaction.reference || event.reference || '';
      
      // Si no hay metadatos, intentar extraer de la referencia
      // La referencia tiene formato: LIBRO_{libroId}_USER_{userId}_{timestamp}
      if (!libro_id || !user_id) {
        console.log('📝 Intentando extraer metadatos de la referencia:', reference);
        
        const referenceMatch = reference.match(/LIBRO_(\d+)_USER_([^_]+)_/);
        if (referenceMatch) {
          libro_id = referenceMatch[1];
          user_id = referenceMatch[2];
          console.log('✅ Metadatos extraídos de la referencia:', { libro_id, user_id });
        }
      }
      
      // Si aún no tenemos metadatos, buscar en transacciones pendientes por referencia
      // Usar service role client para poder leer transacciones pendientes
      const supabase = createServiceRoleClient();
      
      if ((!libro_id || !user_id) && reference) {
        console.log('🔍 Buscando transacción pendiente por referencia:', reference);
        const { data: transPendiente } = await supabase
          .from('transacciones_pendientes')
          .select('user_id, user_email, libro_id')
          .eq('reference', reference)
          .in('estado', ['pendiente', 'procesando'])
          .single();
        
        if (transPendiente) {
          libro_id = transPendiente.libro_id.toString();
          user_id = transPendiente.user_id || undefined;
          console.log('✅ Transacción pendiente encontrada:', { 
            libro_id, 
            user_id, 
            user_email: transPendiente.user_email 
          });
        }
      }
      
      console.log('📝 Metadatos encontrados:', { libro_id, user_id });
      console.log('📝 Metadatos completos:', metadata);
      console.log('📝 Referencia de la transacción:', reference);
      
      if (!libro_id) {
        console.error('❌ No se pudo determinar libro_id de la transacción');
        console.error('Referencia:', reference);
        console.error('Datos completos de la transacción:', JSON.stringify(transaction, null, 2));
        return NextResponse.json({ 
          received: true, 
          warning: 'No se pudo determinar libro_id - transacción recibida pero no procesada' 
        });
      }

      // Verificar que el pago fue exitoso
      // Wompi usa diferentes estados: APPROVED, APPROVED_PARTIAL, DECLINED, VOIDED, etc.
      const status = transaction.status || 
                     transaction.data?.status || 
                     event.status;
      
      console.log('📊 Estado de la transacción:', status);
      
      // Estados de Wompi que indican pago exitoso
      const approvedStatuses = ['APPROVED', 'APPROVED_PARTIAL'];
      
      if (approvedStatuses.includes(status?.toUpperCase())) {
        try {
          console.log('✅ Pago aprobado, registrando compra...');
          
          // Usar service role client para poder insertar compras sin restricciones RLS
          // (ya está definido arriba)
          
          // Obtener el monto pagado (Wompi usa amount_in_cents)
          const amountInCents = transaction.amount_in_cents || 
                               transaction.data?.amount_in_cents ||
                               (transaction.amount ? Math.round(transaction.amount * 100) : 0);
          const amount = (amountInCents / 100).toFixed(2);

          // Determinar el método de pago
          const paymentMethod = transaction.payment_method_type || 
                               transaction.payment_method?.type ||
                               transaction.payment_method_type_name ||
                               'wompi';

          const transactionId = transaction.id || 
                              transaction.data?.id || 
                              event.id;

          console.log('💰 Monto:', amount, 'COP');
          console.log('💳 Método de pago:', paymentMethod);
          console.log('🆔 ID de transacción:', transactionId);

          // Si no tenemos user_id pero tenemos referencia, buscar en transacciones pendientes
          if (!user_id && reference) {
            const { data: transPendiente } = await supabase
              .from('transacciones_pendientes')
              .select('user_id, user_email')
              .eq('reference', reference)
              .single();
            
            if (transPendiente) {
              user_id = transPendiente.user_id || undefined;
              console.log('✅ user_id encontrado desde transacción pendiente:', user_id);
            }
          }

          // Si aún no tenemos user_id, no podemos registrar la compra
          if (!user_id) {
            console.error('❌ No se pudo determinar user_id de la transacción');
            console.error('⚠️ Guardando transacción pendiente para procesamiento posterior');
            
            // Actualizar la transacción pendiente con el estado y el ID de Wompi
            if (reference) {
              await supabase
                .from('transacciones_pendientes')
                .update({
                  estado: 'procesando',
                  transaccion_wompi_id: transactionId,
                })
                .eq('reference', reference);
            }
            
            return NextResponse.json({ 
              received: true, 
              warning: 'user_id no disponible - transacción guardada para procesamiento posterior' 
            });
          }

          // Crear o actualizar el registro de compra
          const { error: compraError } = await supabase
            .from('compras_libros')
            .upsert({
              user_id: user_id,
              libro_id: parseInt(libro_id),
              estado_pago: 'completado',
              monto_pagado: amount,
              metodo_pago: paymentMethod.toLowerCase(),
              transaccion_id: transactionId,
            }, {
              onConflict: 'user_id,libro_id'
            });

          if (compraError) {
            console.error('❌ Error al registrar la compra:', compraError);
            return NextResponse.json(
              { error: 'Error al registrar la compra' },
              { status: 500 }
            );
          }

          // Actualizar la transacción pendiente como completada
          if (reference) {
            await supabase
              .from('transacciones_pendientes')
              .update({
                estado: 'completado',
                transaccion_wompi_id: transactionId,
                procesado_at: new Date().toISOString(),
              })
              .eq('reference', reference);
            console.log('✅ Transacción pendiente marcada como completada');
          }

          console.log(`✅ Compra registrada exitosamente: Usuario ${user_id}, Libro ${libro_id}, Transacción ${transactionId}`);
        } catch (error: any) {
          console.error('❌ Error al procesar la compra:', error);
          console.error('Stack:', error.stack);
          return NextResponse.json(
            { error: 'Error al procesar la compra' },
            { status: 500 }
          );
        }
      } else {
        console.log(`⚠️ Transacción ${transaction.id || 'unknown'} con estado: ${status} - No se registra como completada`);
      }
    }

    console.log('✅ Webhook procesado correctamente');
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('❌ Error al procesar webhook de Wompi:', error);
    console.error('Stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Error al procesar el webhook' },
      { status: 500 }
    );
  }
}

