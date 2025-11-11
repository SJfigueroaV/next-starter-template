"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import logo from "./logo.svg";
import Image from "next/image";
import LogoConditional from "./LogoConditional";
import Usuario from "./Usuario";
import CerrarSesion from "./Cerrarsesion";
import BottonPanel from "./BottonPanel";

export default function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLibrosRoute = pathname?.startsWith("/libros");

  // Si estamos en /libros, solo renderizar el contenido sin el layout principal
  if (isLibrosRoute) {
    return <>{children}</>;
  }

  // Para otras rutas, renderizar con el layout completo
  return (
    <main className="block md:grid md:grid-cols-[250px_1fr]">
      <aside className="col-span-1 p-8 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <div>
          <LogoConditional>
            <a className="undefined rounded-md focus:outline-none transition hover:scale-110 inline-flex overflow-hidden" href="/">
              <Image src={logo} alt="Logo" width={60} />
            </a>
          </LogoConditional>
        </div>
        <BottonPanel/>
        <nav className="flex-col hidden mt-12 gap-y-4 md:flex">
          <div className="flex items-center">
            <Usuario />
          </div>

          <div className="flex flex-col items-start pr-1 mt-4 gap-y-4">
            <a className="items-center justify-center hidden text-sm font-semibold text-white/80 md:flex group hover:text-yellow-300 gap-x-2" href="/logros">
              <svg className="w-6 h-6 transition-transform group-hover:scale-125" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M8 21l8 0"></path>
                <path d="M12 17l0 4"></path>
                <path d="M7 4l10 0"></path>
                <path d="M17 4v8a5 5 0 0 1 -10 0v-8"></path>
                <path d="M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                <path d="M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
              </svg>
              <span className="pl-2 text-sm font-normal transition-colors">Logros - Feature </span>
            </a>

            <CerrarSesion />
          </div>
        </nav>
      </aside>

      <div className="flex flex-col justify-between md:flex-row">
        <main className="w-full max-w-3xl min-w-0 min-h-screen px-6 pt-6 m-auto mb-24 antialiased text-white md:px-3 lg:px-6">
          {children}
        </main>
      </div>

      <svg
        viewBox="0 0 1024 1024"
        className="fixed -right-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 blur-3xl opacity-20"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient
            id="759c1415-0410-454c-8f7c-9a820de03641"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(512 512) rotate(90) scale(512)"
          >
            <stop offset="0" stopColor="#7775D6" />
            <stop offset="1" stopColor="#E935C1" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle
          cx="512"
          cy="512"
          r="512"
          fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
          fillOpacity="0.7"
        />
      </svg>
    </main>
  );
}

