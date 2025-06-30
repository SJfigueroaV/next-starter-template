"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import GoogleSignInButton from "./GoogleSignInButton";
import { User } from '@supabase/supabase-js';
import { tema } from "./type";
import Link from "next/link";

export default function HomeClient({ temasGenerales }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [progreso, setProgreso] = useState<{ [subtemaId: string]: string }>({});

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  useEffect(() => {
    const fetchProgreso = async () => {
      if (!user) return;
      // Obtener todos los subtemaIds
      const subtemaIds = temasGenerales
        .flatMap((tema: any) => tema.subtemas?.map((s: any) => s.id) || []);
      if (subtemaIds.length === 0) return;
      // Traer el progreso de todos los subtemas para el usuario
      const { data, error } = await supabase
        .from('progreso_subtemas')
        .select('subtema_id, estado')
        .eq('user_id', user.id)
        .in('subtema_id', subtemaIds);
      if (!error && data) {
        const progresoObj: { [subtemaId: string]: string } = {};
        data.forEach((row: any) => {
          progresoObj[row.subtema_id] = row.estado;
        });
        setProgreso(progresoObj);
      }
    };
    fetchProgreso();
  }, [user, temasGenerales]);

  // SVGs para los diferentes estados
  const SvgDefault = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-gray-300"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95" />
      <path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" />
      <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
      <path d="M8.56 20.31a9 9 0 0 0 3.44 .69" />
      <path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" />
      <path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" />
      <path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" />
      <path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" />
    </svg>
  );
  const SvgEnProgreso = (
    <svg className="w-6 h-6 text-yellow-200" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M10 20.777a8.942 8.942 0 0 1 -2.48 -.969"></path><path d="M14 3.223a9.003 9.003 0 0 1 0 17.554"></path><path d="M4.579 17.093a8.961 8.961 0 0 1 -1.227 -2.592"></path><path d="M3.124 10.5c.16 -.95 .468 -1.85 .9 -2.675l.169 -.305"></path><path d="M6.907 4.579a8.954 8.954 0 0 1 3.093 -1.356"></path><path d="M9 12l2 2l4 -4"></path></svg>
  );
  const SvgCompletado = (
    <svg className="w-6 h-6 text-green-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path><path d="M9 12l2 2l4 -4"></path></svg>
  );

  return (
    <div >
        <div className="max-w-lg mt-2 mb-0 md:mt-8 lg:pb-8 lg:max-w-2xl">
                    <h1 className="max-w-2xl mt-0 mb-4 text-5xl font-extrabold text-white md:mt-24 md:text-6xl lg:text-6xl">
                Siembra la Palabra de Dios en toda gente, pueblo y nación
            </h1>
            <p className="mb-4 font-semibold text-blue-500 text-md lg:text-3xl">
                Personas transformadas viviendo <br /> el evangelio de Jesús. <br /> Transformando el mundo.
            </p>
            <div className="flex flex-col gap-2 mb-4 lg:items-center lg:mb-0 lg:flex-row" >
                {!user && (
                    <div className="flex flex-col gap-2 mb-4 lg:items-center lg:mb-0 lg:flex-row">
                    <GoogleSignInButton />
                    </div>
                )}
            </div>
           

            
        </div>
        {!user && (
                    <small className="block max-w-lg p-4 mb-8 text-sm font-bold border rounded-sm border-sky-400 bg-sky-950/80">Para desbloquear el contenido, debes iniciar sesión antes.</small>
                )}
        
      {/* Render de los temas */}
      <ul className='grid gap-16 text-white'>
        {temasGenerales && temasGenerales.length > 0 ? (
  temasGenerales.map((tema: tema) => (
    <li
      key={tema.id}
      className={`${!user ? "opacity-60 pointer-events-none" : ""}`}
    >
      <header className="flex flex-col items-start mb-4 md:items-center md:flex-row">
        <h2 className='text-3xl font-bold text-blue-500'>{tema.nombre}</h2>
      </header>

      {tema.subtemas && tema.subtemas.length > 0 ? (
        <div className='flex flex-col gap-8 md:flex-row md:gap-16'>
          <div className='w-full text-lg md:w-2/5'>
            <p>{tema.descripcion}</p>
          </div>
          <div>
            <ul className="mb-4 ml-4 list-disc md:ml-0">
              {tema.subtemas.map((subtema: any, idx: number) => {
                let icon = SvgDefault;
                if (user) {
                  if (progreso[subtema.id] === "en_progreso") icon = SvgEnProgreso;
                  if (progreso[subtema.id] === "completado") icon = SvgCompletado;
                }
                // Lógica de desbloqueo progresivo
                let desbloqueado = false;
                if (idx === 0) {
                  desbloqueado = true;
                } else {
                  const anterior = tema.subtemas[idx - 1];
                  desbloqueado = progreso[anterior.id] === "completado";
                }
                return (
                  <li key={subtema.id} className={`flex items-center mb-2 list-none ${!desbloqueado ? "opacity-50 cursor-not-allowed" : ""}`}>
                    {icon}
                    {desbloqueado ? (
                      <Link
                        className='inline-flex items-center px-2 py-1 text-xl font-semibold rounded-lg hover:pointer hover:text-blue-500 gap-x-2'
                        href={`/clase/${tema.slug}/${subtema.slug}`}
                      >
                        {subtema.nombre}
                      </Link>
                    ) : (
                      <span className='inline-flex items-center px-2 py-1 text-xl font-semibold rounded-lg gap-x-2 select-none'>
                        {subtema.nombre} <span className="ml-2 text-xs text-gray-400">(Bloqueado)</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-gray-300 ml-4">Sin subtemas</p>
      )}
    </li>
  ))
) : (
  <p className="text-gray-300">No se encontraron temas generales</p>
)}
      </ul>
    </div>
  );
}
