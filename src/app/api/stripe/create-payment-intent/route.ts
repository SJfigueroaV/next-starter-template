import { NextResponse } from 'next/server';
import { createClient } from '@/supabaseServer';
import Stripe from 'stripe';

// Validar que la clave secreta de Stripe esté configurada
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('⚠️ STRIPE_SECRET_KEY no está configurada en las variables de entorno');
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
}) : null;

export async function POST(request: Request) {
  try {
    // Verificar que Stripe esté configurado
    if (!stripe) {
      console.error('STRIPE_SECRET_KEY no está configurada');
      return NextResponse.json(
        { error: 'Stripe no está configurado. Por favor, agrega STRIPE_SECRET_KEY a tu archivo .env.local' },
        { status: 500 }
      );
    }

    const { libroId, userId } = await request.json();

    if (!libroId || !userId) {
      return NextResponse.json(
        { error: 'libroId y userId son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el usuario está autenticado
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Obtener información del libro
    const { data: libro, error: libroError } = await supabase
      .from('libros')
      .select('id, titulo, precio')
      .eq('id', libroId)
      .single();

    if (libroError || !libro) {
      return NextResponse.json(
        { error: 'Libro no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el usuario ya compró el libro
    const { data: compraExistente } = await supabase
      .from('compras_libros')
      .select('id')
      .eq('user_id', userId)
      .eq('libro_id', libroId)
      .eq('estado_pago', 'completado')
      .single();

    if (compraExistente) {
      return NextResponse.json(
        { error: 'Ya has comprado este libro' },
        { status: 400 }
      );
    }

    // Crear Payment Intent en Stripe
    const amount = Math.round(libro.precio * 100); // Convertir a centavos

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      metadata: {
        libro_id: libroId.toString(),
        user_id: userId,
        libro_titulo: libro.titulo,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Error al crear Payment Intent:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar el pago' },
      { status: 500 }
    );
  }
}

