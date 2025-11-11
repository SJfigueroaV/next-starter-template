"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Libro = {
  id: number;
  titulo: string;
  precio: number;
};

type WompiCheckoutClientProps = {
  libro: Libro;
  user: any;
};

export default function WompiCheckoutClient({ libro, user }: WompiCheckoutClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleIniciarPago = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/wompi/create-transaction", {
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
        throw new Error(data.error || "Error al crear la transacción");
      }

      if (!data.checkoutUrl) {
        throw new Error("No se recibió la URL de checkout de Wompi");
      }

      // Redirigir a la página de pago de Wompi
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      console.error("Error al iniciar pago:", err);
      setError(err.message || "Error desconocido al iniciar el pago");
      setLoading(false);
    }
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
              <span className="text-2xl font-bold text-yellow-400">
                ${libro.precio.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} COP
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
              <h3 className="font-semibold text-blue-400 mb-2">Métodos de pago disponibles:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>💰 Nequi</li>
                <li>🏦 PSE (Pagos Seguros en Línea)</li>
                <li>💳 Tarjetas de crédito/débito</li>
                <li>🏪 Efecty</li>
                <li>🎫 Baloto</li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleIniciarPago}
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-500 hover:to-green-600 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Pagar con Wompi</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Serás redirigido a la plataforma segura de Wompi para completar tu pago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

