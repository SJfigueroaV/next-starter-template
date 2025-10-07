"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import GoogleSignInButton from "./GoogleSignInButton";
import { User } from '@supabase/supabase-js';
import { tema } from "./type";
import Link from "next/link";
import Image from "next/image";

export default function HomeClient({ temasGenerales }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [progreso, setProgreso] = useState<{ [subtemaId: string]: string }>({});
  const [ultimoSubtema, setUltimoSubtema] = useState<any>(null);

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

  // Buscar el último subtema en progreso o visitado
  useEffect(() => {
    const buscarUltimoSubtema = async () => {
      if (!user || !temasGenerales) return;
      
      // Buscar subtemas en progreso o completados
      const subtemasConProgreso = temasGenerales.flatMap((tema: any) => 
        tema.subtemas?.map((subtema: any) => ({
          ...subtema,
          tema: tema,
          estado: progreso[subtema.id]
        })) || []
      ).filter((subtema: any) => subtema.estado === 'en_progreso' || subtema.estado === 'completado');

      if (subtemasConProgreso.length > 0) {
        // Ordenar por orden y tomar el último
        const ultimo = subtemasConProgreso.sort((a: any, b: any) => {
          if (a.tema.id !== b.tema.id) return a.tema.id - b.tema.id;
          return a.orden - b.orden;
        }).pop();
        
        setUltimoSubtema(ultimo);
      }
    };

    buscarUltimoSubtema();
  }, [user, temasGenerales, progreso]);

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
            {user && ultimoSubtema && (
              <Link 
                className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-black shadow-xs hover:bg-yellow-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition hover:scale-105 mb-6" 
                href={`/clase/${ultimoSubtema.tema.slug}/${ultimoSubtema.slug}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M4 5v6a3 3 0 0 0 3 3h7"></path>
                  <path d="M10 10l4 4l-4 4m5 -8l4 4l-4 4"></path>
                </svg>
                <div className="flex flex-col items-start pl-1 pr-3">
                  <span className="block">¡Sigue por donde lo dejaste!</span>
                  <strong className="text-base font-bold opacity-80">
                    {ultimoSubtema.tema.nombre} − {ultimoSubtema.nombre}
                  </strong>
                </div>
              </Link>
            )}
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
  temasGenerales.map((tema: tema, temaIndex: number) => (
    <li
      key={tema.id}
      className={`${!user ? "opacity-60 pointer-events-none" : ""}`}
    >
      <header className="flex flex-col items-start mb-4 md:items-center md:flex-row">
        <h2 className='text-3xl font-bold text-blue-500'>{tema.nombre}</h2>
      </header>

      {tema.subtemas && tema.subtemas.length > 0 ? (
        <div className='flex flex-col gap-8 md:flex-row md:gap-16'>
          <div className='w-full text-lg md:w-2/5 flex justify-center'>
            {tema.slug === 'todo-es-posible-para-dios' ? (
              <div className="card w-64 p-0" style={{ height: '359px' }}>
                <div className="image-container">
                  <Image
                    src="/todo-es-posible-para-dios.jpg"
                    alt="Todo es posible para Dios - Portada"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="shimmer-effect"></div>
                </div>
              </div>
            ) : (
              <p>{tema.descripcion}</p>
            )}RE
          </div>
          <div>
            <ul className="mb-4 ml-4 list-disc md:ml-0">
              {tema.subtemas.map((subtema: any, idx: number) => {
                let icon = SvgDefault;
                if (user) {
                  if (progreso[subtema.id] === "en_progreso") icon = SvgEnProgreso;
                  if (progreso[subtema.id] === "completado") icon = SvgCompletado;
                }
                
                // Lógica de desbloqueo progresivo entre módulos
                let desbloqueado = false;
                
                // Si es el primer subtema del primer módulo, siempre está desbloqueado
                if (temaIndex === 0 && idx === 0) {
                  desbloqueado = true;
                } else if (idx === 0) {
                  // Si es el primer subtema de otros módulos, verificar que el último subtema del módulo anterior esté completado
                  const temaAnterior = temasGenerales[temaIndex - 1];
                  if (temaAnterior && temaAnterior.subtemas && temaAnterior.subtemas.length > 0) {
                    const ultimoSubtemaAnterior = temaAnterior.subtemas[temaAnterior.subtemas.length - 1];
                    desbloqueado = progreso[ultimoSubtemaAnterior.id] === "completado";
                  } else {
                    desbloqueado = false;
                  }
                } else {
                  // Para subtemas que no son el primero, verificar el subtema anterior del mismo módulo
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
                      <span className="flex flex-col items-start px-2 py-1 text-xl font-semibold rounded-lg gap-y-1 select-none">
                        <span className="ml-1 text-xs text-gray-400 whitespace-nowrap mb-1">(Bloqueado)</span>
                        <span className="break-words">{subtema.nombre}</span>
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
