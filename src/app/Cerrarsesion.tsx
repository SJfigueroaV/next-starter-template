// src/app/CerrarSesion.tsx
"use client";

import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CerrarSesion() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Obtener sesión actual
        const getSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };

        getSession();

        // Escuchar cambios en la sesión
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.reload(); // recarga la página actual
    };


    if (!user) return null; // No mostrar si no hay sesión

    return (
        <button
            onClick={handleSignOut}
            className="items-center justify-center hidden text-sm font-semibold text-white/80 md:flex group hover:text-yellow-300 gap-x-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transition-transform group-hover:scale-125" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2"></path>
                <path d="M15 12h-12l3 -3"></path>
                <path d="M6 15l-3 -3"></path>
            </svg>
            <span className="pl-2 text-sm font-normal transition-colors">Cerrar sesión</span>
        </button>
    );
}
