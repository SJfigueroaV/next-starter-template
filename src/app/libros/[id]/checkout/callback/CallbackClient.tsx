"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type CallbackClientProps = {
  libroId: number;
  userId: string;
  transactionId?: string;
  status?: string;
  reference?: string;
};

export default function CallbackClient({ libroId, userId, transactionId, status, reference }: CallbackClientProps) {
  const router = useRouter();
  const [verificando, setVerificando] = useState(true);
  const [pagoExitoso, setPagoExitoso] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verificarPago = async () => {
      // Si no hay transactionId, puede que Wompi aún no haya redirigido con el ID
      // Intentar verificar de todas formas, o esperar un poco
      if (!transactionId) {
        console.warn('⚠️ No se recibió transactionId en la URL');
        // Esperar un poco y verificar si el webhook ya procesó el pago
        // usando solo libroId y userId
        setTimeout(async () => {
          try {
            const response = await fetch(`/api/wompi/verify-transaction?libroId=${libroId}&userId=${userId}`);
            const data = await response.json() as { completado?: boolean; mensaje?: string; error?: string };
            if (data.completado) {
              setPagoExitoso(true);
              setTimeout(() => {
                // Incluir userId en la URL para permitir acceso temporal si las cookies se pierden
                router.push(`/libros/${libroId}/leer?userId=${userId}&tempAccess=true`);
                router.refresh();
              }, 2000);
            } else {
              setError("No se recibió información de la transacción. Por favor, verifica en tu cuenta si el pago fue procesado.");
            }
          } catch (err) {
            setError("Error al verificar el pago. Por favor, verifica en tu cuenta si el pago fue procesado.");
          } finally {
            setVerificando(false);
          }
        }, 3000); // Esperar 3 segundos para que el webhook procese
        return;
      }

      try {
        // PRIMERO: Intentar verificar manualmente con la referencia si está disponible
        // Esto es más rápido y confiable que esperar al webhook
        if (reference) {
          console.log('🔄 Verificando manualmente con la referencia:', reference);
          try {
            const verifyResponse = await fetch('/api/wompi/verify-and-register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                reference,
                libroId,
                userId,
              }),
            });

            const verifyData = await verifyResponse.json() as { success?: boolean; error?: string; message?: string };

            if (verifyData.success) {
              console.log('✅ Pago verificado y registrado manualmente');
              setPagoExitoso(true);
              setTimeout(() => {
                // Incluir userId en la URL para permitir acceso temporal si las cookies se pierden
                router.push(`/libros/${libroId}/leer?userId=${userId}&tempAccess=true`);
                router.refresh();
              }, 2000);
              return;
            } else {
              console.warn('⚠️ Verificación manual falló:', verifyData.error || verifyData.message);
            }
          } catch (verifyErr) {
            console.error('Error al verificar manualmente:', verifyErr);
          }
        }

        // SEGUNDO: Si la verificación manual falló, intentar verificar en la base de datos
        // (puede que el webhook ya haya procesado)
        let intentos = 0;
        const maxIntentos = 3; // Reducido a 3 intentos ya que la verificación manual debería funcionar
        const intervalo = 2000; // 2 segundos entre intentos
        
        const verificar = async (): Promise<boolean> => {
          const response = await fetch(`/api/wompi/verify-transaction?transactionId=${transactionId}&libroId=${libroId}&userId=${userId}`);
          const data = await response.json() as { completado?: boolean; mensaje?: string; error?: string };
          
          if (data.completado) {
            return true;
          }
          
          // Si aún no está, esperar y reintentar
          if (intentos < maxIntentos) {
            intentos++;
            await new Promise(resolve => setTimeout(resolve, intervalo));
            return verificar();
          }
          
          return false;
        };
        
        const completado = await verificar();
        
        if (completado) {
          setPagoExitoso(true);
          // Redirigir a la página de lectura después de 2 segundos
          setTimeout(() => {
            // Incluir userId en la URL para permitir acceso temporal si las cookies se pierden
            router.push(`/libros/${libroId}/leer?userId=${userId}&tempAccess=true`);
            router.refresh();
          }, 2000);
        } else {
          setError("El pago está siendo procesado. Por favor, espera unos segundos y recarga la página, o verifica en tu cuenta si el pago fue procesado.");
        }
      } catch (err: any) {
        console.error("Error al verificar pago:", err);
        setError("Error al verificar el estado del pago. Por favor, verifica en tu cuenta si el pago fue procesado.");
      } finally {
        setVerificando(false);
      }
    };

    verificarPago();
  }, [transactionId, libroId, userId, router]);

  if (verificando) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Verificando pago...</p>
        </div>
      </div>
    );
  }

  if (pagoExitoso) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-green-500/10 border border-green-500 rounded-lg p-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">¡Pago exitoso!</h2>
            <p className="text-gray-300 mb-4">Tu compra ha sido procesada correctamente.</p>
            <p className="text-sm text-gray-400">Redirigiendo a tu libro...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-6">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Pago no completado</h2>
          <p className="text-gray-300 mb-4">{error || "El pago no se procesó correctamente."}</p>
          <div className="space-y-2">
            <Link
              href={`/libros/${libroId}/checkout`}
              className="inline-block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Intentar de nuevo
            </Link>
            <Link
              href={`/libros/${libroId}`}
              className="inline-block w-full px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Volver al detalle del libro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

