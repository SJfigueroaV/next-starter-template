"use client";
import { motion } from "framer-motion";
import { useScrollDirection } from "../../components/scrollAnimation"; // Asegúrate de importar bien

export default function MobileMenu() {
    const scrollDirection = useScrollDirection();

    return (
        <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-md md:hidden"
            initial={{ y: 0 }}
            animate={{ y: scrollDirection === "down" ? 100 : 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className=" fixed bottom-0 left-0 z-50 w-full h-16 border-t border-yellow-500/20 md:hidden bg-black/50 backdrop-blur-lg">
                <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
                    <a className="inline-flex flex-col items-center justify-center px-5 hover:bg-black group" href="/">
                        <svg className="w-5 h-5 mb-1 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                        </svg>
                        <span className="text-xs text-white">Inicio</span>
                    </a>
                    
                    <a className="inline-flex flex-col items-center justify-center px-5 hover:bg-black group" href="/logros">
                        <svg className="w-5 h-5 mb-1 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M8 21l8 0"></path>
                            <path d="M12 17l0 4"></path>
                            <path d="M7 4l10 0"></path>
                            <path d="M17 4v8a5 5 0 0 1 -10 0v-8"></path>
                            <path d="M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                            <path d="M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        </svg>
                        <span className="text-xs text-white">Logros</span>
                    </a>
                    
                    <a className="inline-flex flex-col items-center justify-center px-5 hover:bg-black group" href="/">
                        <svg className="w-5 h-5 mb-1 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M9 9v-1a3 3 0 0 1 6 0v1"></path>
                            <path d="M8 9h8a6 6 0 0 1 1 3v3a5 5 0 0 1 -10 0v-3a6 6 0 0 1 1 -3"></path>
                            <path d="M3 13l4 0"></path>
                            <path d="M17 13l4 0"></path>
                            <path d="M12 20l0 -6"></path>
                            <path d="M4 19l3.35 -2"></path>
                            <path d="M20 19l-3.35 -2"></path>
                            <path d="M4 7l3.75 2.4"></path>
                            <path d="M20 7l-3.75 2.4"></path>
                        </svg>
                        <span className="text-xs text-white">Reportar</span>
                    </a>
                </div>
            </div>
        </motion.div>
    );
}