"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
export default function UserProfile() {
    const [user, setUser] = useState<any>(null);
    const [verificando, setVerificando] = useState(false);
    const [resultado, setResultado] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
        });
    }, []);

    const verificarPagosPendientes = async () => {
        setVerificando(true);
        setResultado(null);
        try {
            const response = await fetch('/api/pagos/verificar-pendientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setResultado(data);
            console.log('Resultado de verificación:', data);
        } catch (error) {
            console.error('Error al verificar pagos:', error);
            setResultado({ error: 'Error al verificar pagos pendientes' });
        } finally {
            setVerificando(false);
        }
    };

    if (!user) return null;

    const avatar = user.user_metadata?.avatar_url;
    const name = user.user_metadata?.full_name || user.email;

    return (
        <div className="space-y-2">
            <div className="relative flex items-center jSustify-center group">
                <img
                    src={avatar}
                    alt="Avatar del usuario"
                    className="w-10 h-10 transition rounded-full"
                    width={40}
                    height={40}
                />
                <span className="pl-3 text-xl font-medium text-yellow-300">{name}</span>
            </div>
            
            {/* Botón temporal para verificar pagos pendientes */}
            <button
                onClick={verificarPagosPendientes}
                disabled={verificando}
                className="w-full px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {verificando ? 'Verificando...' : 'Verificar Pagos Pendientes'}
            </button>
            
            {resultado && (
                <div className="p-2 text-xs bg-gray-800 rounded">
                    {resultado.error ? (
                        <p className="text-red-400">Error: {resultado.error}</p>
                    ) : (
                        <div>
                            <p className="text-green-400">
                                Procesadas: {resultado.procesadas || 0} de {resultado.total || 0}
                            </p>
                            {resultado.resultados && resultado.resultados.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    {resultado.resultados.map((r: any, i: number) => (
                                        <p key={i} className="text-gray-300">
                                            {r.reference}: {r.estado} - {r.mensaje}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
