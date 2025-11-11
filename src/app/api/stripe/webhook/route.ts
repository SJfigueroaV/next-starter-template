import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabaseServiceRole';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Falta la firma de Stripe' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Error al verificar webhook:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Manejar el evento
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    const { libro_id, user_id } = paymentIntent.metadata;
    
    if (!libro_id || !user_id) {
      console.error('Faltan metadatos en el Payment Intent');
      return NextResponse.json({ error: 'Metadatos faltantes' }, { status: 400 });
    }

    try {
      // Usar service role client para poder insertar compras sin restricciones RLS
      const supabase = createServiceRoleClient();
      
      // Crear o actualizar el registro de compra
      const { error: compraError } = await supabase
        .from('compras_libros')
        .upsert({
          user_id: user_id,
          libro_id: parseInt(libro_id),
          estado_pago: 'completado',
          monto_pagado: (paymentIntent.amount / 100).toFixed(2),
          metodo_pago: 'stripe',
          transaccion_id: paymentIntent.id,
        }, {
          onConflict: 'user_id,libro_id'
        });

      if (compraError) {
        console.error('Error al registrar la compra:', compraError);
        return NextResponse.json(
          { error: 'Error al registrar la compra' },
          { status: 500 }
        );
      }

      console.log(`Compra registrada: Usuario ${user_id}, Libro ${libro_id}`);
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      return NextResponse.json(
        { error: 'Error al procesar la compra' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

