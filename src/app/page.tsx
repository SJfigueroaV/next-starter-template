import Image from "next/image";
import GoogleSignInButton from "./GoogleSignInButton";
import { supabase } from "@/supabaseClient";

export default async function Home() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: temasGenerales } = await supabase
    .from("temas_generales")
    .select(`*, subtemas(*)`);
  return (
    <main>
      <div className="max-w-lg mt-2 mb-0 md:mt-8 lg:pb-8 lg:max-w-2xl">
          <h1 className="max-w-2xl mt-0 mb-4 text-5xl font-extrabold text-white md:mt-24 md:text-6xl lg:text-6xl">
            Siembra la Palabra de Dios en toda gente, pueblo y nación
          </h1>
          <p className="mb-4 font-semibold text-blue-500 text-md lg:text-3xl">
            Personas transformadas viviendo <br /> el evangelio de Jesús. <br /> Transformando el mundo.
          </p>
          <div className="flex flex-col gap-2 mb-4 lg:items-center lg:mb-0 lg:flex-row">
            <GoogleSignInButton />

          </div>

      </div>
      <ul className='grid gap-16 text-white'>
          {temasGenerales && temasGenerales.length > 0 ? (
            temasGenerales.map((tema) => (
              <li key={tema.id} className="opacity-60 pointer-events-none">
                <header className="flex flex-col items-start mb-4 md:items-center md:flex-row">
                  <h2 className='text-3xl font-bold text-blue-500' >{tema.nombre}</h2>

                </header>

                {tema.subtemas && tema.subtemas.length > 0 ? (
                  <div className='flex flex-col gap-8 md:flex-row md:gap-16' >
                    <div className='w-full text-lg md:w-2/5' >
                      <p>{tema.descripcion}</p>
                    </div>
                    <div>
                      <ul className="mb-4 ml-4 list-disc md:ml-0">
                        {tema.subtemas.map((subtema: any) => (
                          <li key={subtema.id} className="flex items-center mb-2 list-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6 text-gray-300"
                              width="40"
                              height="40"
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
                            <a className='inline-flex items-center px-2 py-1 text-xl font-semibold rounded-lg hover:pointer hover:text-yellow-400 gap-x-2' href="">
                              {subtema.nombre}
                            </a>

                          </li>
                        ))}
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
    </main>
  );
}
