import { NextResponse } from 'next/server';
import { createClient } from '@/supabaseServer';
import crypto from 'crypto';

// Validar que las claves de Wompi estén configuradas
const wompiPublicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
const wompiIntegritySecret = process.env.WOMPI_INTEGRITY_SECRET;

if (!wompiPublicKey) {
  console.error('⚠️ NEXT_PUBLIC_WOMPI_PUBLIC_KEY no está configurada en las variables de entorno');
}

if (!wompiIntegritySecret) {
  console.error('⚠️ WOMPI_INTEGRITY_SECRET no está configurada en las variables de entorno');
}

export async function POST(request: Request) {
  try {
    // Verificar que Wompi esté configurado
    if (!wompiPublicKey || !wompiIntegritySecret) {
      return NextResponse.json(
        { error: 'Wompi no está configurado. Por favor, agrega NEXT_PUBLIC_WOMPI_PUBLIC_KEY y WOMPI_INTEGRITY_SECRET a tu archivo .env.local' },
        { status: 500 }
      );
    }

    const body = await request.json() as { libroId: number; userId: string };
    const { libroId, userId } = body;

    if (!libroId || !userId) {
      return NextResponse.json(
        { error: 'libroId y userId son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el usuario está autenticado
    // Usar getSession() en lugar de getUser() para evitar refresh automático del token
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    let user = session?.user ?? undefined;

    if (!user || user.id !== userId) {
      // Si no hay sesión, intentar getUser() como fallback
      // Pero solo si realmente no hay sesión para evitar múltiples refreshes
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
      
      if (!user || user.id !== userId) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 401 }
        );
      }
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

    // Crear la transacción usando Web Checkout de Wompi
    // Este método NO requiere payment_method ni payment_source
    const amountInCents = Math.round(libro.precio * 100); // Wompi usa centavos
    const reference = `LIBRO_${libroId}_USER_${userId}_${Date.now()}`;
    
    // URL de retorno después del pago
    const requestUrl = new URL(request.url);
    let returnUrl = `${requestUrl.origin}/libros/${libroId}/checkout/callback`;
    
    // Corregir protocolo si es necesario
    if (returnUrl.startsWith('https://localhost')) {
      returnUrl = returnUrl.replace('https://localhost', 'http://localhost');
      console.log('⚠️ Corregido redirect_url de https://localhost a http://localhost');
    }
    
    console.log('🔗 Return URL:', returnUrl);

    // Generar la firma de integridad
    // La firma se genera con: SHA256(reference + amount_in_cents + currency + integrity_secret)
    // Según la documentación de Wompi
    const signatureString = `${reference}${amountInCents}COP${wompiIntegritySecret}`;
    const signature = crypto
      .createHash('sha256')
      .update(signatureString)
      .digest('hex');

    console.log('✅ Firma de integridad generada');

    // Construir la URL de checkout de Wompi
    // Método Web Checkout: https://checkout.wompi.co/p/ con parámetros GET
    const checkoutUrl = new URL('https://checkout.wompi.co/p/');
    checkoutUrl.searchParams.set('public-key', wompiPublicKey);
    checkoutUrl.searchParams.set('currency', 'COP');
    checkoutUrl.searchParams.set('amount-in-cents', amountInCents.toString());
    checkoutUrl.searchParams.set('reference', reference);
    checkoutUrl.searchParams.set('signature:integrity', signature);
    
    // Agregar los metadatos a la URL de redirección para que el callback pueda usarlos
    // Wompi redirigirá con el ID de la transacción, pero necesitamos los metadatos
    const redirectUrlWithMetadata = new URL(returnUrl);
    redirectUrlWithMetadata.searchParams.set('libro_id', libroId.toString());
    redirectUrlWithMetadata.searchParams.set('user_id', userId);
    redirectUrlWithMetadata.searchParams.set('reference', reference);
    checkoutUrl.searchParams.set('redirect-url', redirectUrlWithMetadata.toString());
    
    // Agregar información del cliente si está disponible
    if (user.email) {
      checkoutUrl.searchParams.set('customer-data:email', user.email);
    }
    
    console.log('📝 Metadatos incluidos en redirect-url:', { libro_id: libroId, user_id: userId, reference });

    console.log('✅ URL de checkout generada:', checkoutUrl.toString());

    // Retornar la URL de redirección a Wompi
    return NextResponse.json({
      checkoutUrl: checkoutUrl.toString(),
      reference: reference,
    });
  } catch (error: any) {
    console.error('Error al crear transacción en Wompi:', error);
    return NextResponse.json(
      { error: error.message || 'Error al procesar el pago' },
      { status: 500 }
    );
  }
}
