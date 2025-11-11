"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Validar que la clave de Stripe esté configurada
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.error('⚠️ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no está configurada. Por favor, agrega esta variable a tu archivo .env.local');
}

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

type Libro = {
  id: number;
  titulo: string;
  precio: number;
};

type CheckoutClientProps = {
  libro: Libro;
  user: any;
};

function CheckoutForm({ libro, user, clientSecret }: CheckoutClientProps & { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || "Error al enviar el formulario");
      setLoading(false);
      return;
    }

    const { error: paymentError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/libros/${libro.id}/checkout?payment_intent={PAYMENT_INTENT_CLIENT_SECRET}`,
      },
      redirect: "if_required",
    });

    if (paymentError) {
      setError(paymentError.message || "Error al procesar el pago");
      setLoading(false);
    } else {
      // Pago exitoso, verificar y redirigir
      setTimeout(() => {
        router.push(`/libros/${libro.id}/leer`);
        router.refresh();
      }, 1000);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Cargando formulario de pago...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {loading ? "Procesando..." : `Pagar $${libro.precio.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function CheckoutClient({ libro, user }: CheckoutClientProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar que Stripe esté configurado
  if (!stripePublishableKey) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">Error de configuración</h2>
            <p className="text-gray-300 mb-4">
              La clave pública de Stripe no está configurada. Por favor, agrega <code className="bg-gray-800 px-2 py-1 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> a tu archivo <code className="bg-gray-800 px-2 py-1 rounded">.env.local</code>
            </p>
            <Link
              href={`/libros/${libro.id}`}
              className="inline-block mt-4 text-blue-400 hover:text-blue-300 underline"
            >
              Volver al detalle del libro
            </Link>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            libroId: libro.id,
            userId: user.id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al crear el pago");
        }

        if (!data.clientSecret) {
          throw new Error("No se recibió el clientSecret del servidor");
        }

        setClientSecret(data.clientSecret);
        setError(null);
      } catch (err: any) {
        console.error("Error al crear Payment Intent:", err);
        setError(err.message || "Error desconocido al inicializar el pago");
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [libro.id, user.id]);

  if (loading && !error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Inicializando pago...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6">
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">Error al inicializar el pago</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <div className="bg-gray-800 rounded p-4 mb-4">
              <p className="text-sm text-gray-400 mb-2">Por favor, verifica:</p>
              <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                <li>Que <code className="bg-gray-700 px-1 rounded">STRIPE_SECRET_KEY</code> esté configurada en <code className="bg-gray-700 px-1 rounded">.env.local</code></li>
                <li>Que la clave sea válida (debe empezar con <code className="bg-gray-700 px-1 rounded">sk_test_</code> o <code className="bg-gray-700 px-1 rounded">sk_live_</code>)</li>
                <li>Que hayas reiniciado el servidor después de agregar la variable</li>
                <li>Revisa la consola del servidor para más detalles</li>
              </ul>
            </div>
            <Link
              href={`/libros/${libro.id}`}
              className="inline-block mt-4 text-blue-400 hover:text-blue-300 underline"
            >
              ← Volver al detalle del libro
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">No se pudo inicializar el pago. Por favor, intenta de nuevo.</p>
          <Link
            href={`/libros/${libro.id}`}
            className="inline-block mt-4 text-blue-400 hover:text-blue-300 underline"
          >
            Volver al detalle del libro
          </Link>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Error: Stripe no está configurado correctamente</p>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimary: "#3b82f6",
        colorBackground: "#1f2937",
        colorText: "#ffffff",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto p-6">
        <Link
          href={`/libros/${libro.id}`}
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al detalle del libro
        </Link>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Completar compra</h1>
          <p className="text-gray-300 mb-6">{libro.titulo}</p>
          
          <div className="border-t border-gray-700 pt-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300">Precio:</span>
              <span className="text-2xl font-bold text-yellow-400">${libro.precio.toFixed(2)}</span>
            </div>
          </div>

          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm libro={libro} user={user} clientSecret={clientSecret} />
          </Elements>
        </div>
      </div>
    </div>
  );
}

