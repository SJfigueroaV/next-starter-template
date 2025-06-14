import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import logo from "./logo.svg";
import Image from "next/image";
import Usuario from "./Usuario";
import CerrarSesion from "./Cerrarsesion";
import BottonPanel from "./BottonPanel";
const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Pedagogia del cultivo",
  description: "Institucion ecopedagogica"

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/planta.ico" />

      </head>
      <body className={inter.className}>
        <main className="block md:grid md:grid-cols-[250px_1fr]" >
          
          <aside className="col-span-1 p-8 md:sticky md:top-0 md:h-screen md:overflow-y-auto" >

            <div>
              <a className="undefined rounded-md focus:outline-none transition hover:scale-110 inline-flex overflow-hidden" href="/">
                <Image src={logo} alt="Logo" width={60} />


              </a>

            </div>
            <BottonPanel/>
            <nav className="flex-col hidden mt-12 gap-y-4 md:flex" >
              <div className="flex items-center" >
                <Usuario />
              </div>
              
              

              <div className="flex flex-col items-start pr-1 mt-4 gap-y-4" >
                <a className="items-center justify-center hidden text-sm font-semibold text-white/80 md:flex group hover:text-yellow-300 gap-x-2" href="/logros"><svg className="w-6 h-6 transition-transform group-hover:scale-125" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M8 21l8 0"></path><path d="M12 17l0 4"></path><path d="M7 4l10 0"></path><path d="M17 4v8a5 5 0 0 1 -10 0v-8"></path><path d="M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path></svg><span className="pl-2 text-sm font-normal transition-colors">Logros</span></a>
                <a href="https://github.com/midudev/aprende-javascript-problemas/issues" target="_blank" className="items-center justify-center hidden text-sm font-semibold text-white/80 md:flex group hover:text-yellow-300 gap-x-2" rel="noreferrer"><svg className="w-6 h-6 transition-transform group-hover:scale-125" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 9v-1a3 3 0 0 1 6 0v1"></path><path d="M8 9h8a6 6 0 0 1 1 3v3a5 5 0 0 1 -10 0v-3a6 6 0 0 1 1 -3"></path><path d="M3 13l4 0"></path><path d="M17 13l4 0"></path><path d="M12 20l0 -6"></path><path d="M4 19l3.35 -2"></path><path d="M20 19l-3.35 -2"></path><path d="M4 7l3.75 2.4"></path><path d="M20 7l-3.75 2.4"></path></svg><span className="pl-2 text-sm font-normal transition-colors">Avisar de error</span></a>

                <CerrarSesion />


                {/* <div className="flex flex-col items-start mt-8 gap-y-4" >
                    <a className="items-center justify-center hidden text-sm font-semibold text-white/80 md:flex group hover:text-yellow-300 gap-x-2" href="">
                      <svg className="w-8 h-8 mb-1 ml-1 transition-all" xmlns="http://www.w3.org/2000/svg" width="800" height="800" preserveAspectRatio="xMidYMid" viewBox="0 -28.5 256 256"><path fill="#5865F2" d="M216.856339 16.5966031C200.285002 8.84328665 182.566144 3.2084988 164.041564 0c-2.275041 4.11318106-4.93294 9.64549908-6.765465 14.0464379-19.692104-2.9614483-39.203132-2.9614483-58.5330827 0C96.9108417 9.64549908 94.1925838 4.11318106 91.8971895 0 73.3526068 3.2084988 55.6133949 8.86399117 39.0420583 16.6376612 5.61752293 67.146514-3.4433191 116.400813 1.08711069 164.955721c22.16890891 16.555194 43.65325271 26.611976 64.77502181 33.192855 5.2150826-7.17745 9.8662303-14.807241 13.8730814-22.848315-7.6311949-2.899686-14.9402415-6.478059-21.8464273-10.632298 1.8321746-1.357374 3.6243438-2.776511 5.3558032-4.236706 42.1228202 19.70193 87.8903382 19.70193 129.5099332 0 1.751813 1.460195 3.543631 2.879332 5.355803 4.236706-6.926539 4.174593-14.255589 7.752966-21.886784 10.653002 4.006851 8.02037 8.637996 15.670866 13.873082 22.847965 21.142122-6.580879 42.646399-16.637311 64.815325-33.213209 5.315798-56.28752-9.080862-105.0894778-38.05561-148.3591179ZM85.4738752 135.09489c-12.6448471 0-23.0146535-11.804735-23.0146535-26.179989 0-14.3752538 10.1483733-26.2003423 23.0146535-26.2003423 12.8666312 0 23.2360868 11.804384 23.0146538 26.2003423.020002 14.375254-10.1480226 26.179989-23.0146538 26.179989Zm85.0513618 0c-12.644847 0-23.014653-11.804735-23.014653-26.179989 0-14.3752538 10.148022-26.2003423 23.014653-26.2003423 12.866281 0 23.236087 11.804384 23.014654 26.2003423 0 14.375254-10.148373 26.179989-23.014654 26.179989Z"></path></svg>
                      <span className="pl-2 text-lg font-normal transition-colors">Entra a Discord</span>
                    </a>

                    
                  </div> */}
              </div>
            </nav>
          </aside>

          <div className="flex flex-col justify-between md:flex-row" >
            <main className="w-full max-w-3xl min-w-0 min-h-screen px-6 pt-6 m-auto mb-24 antialiased text-white md:px-3 lg:px-6" >
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
      </body>
    </html>
  );
}
