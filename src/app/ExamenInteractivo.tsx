"use client";
import { useState, useEffect } from "react";
import clsx from "clsx";

export type Pregunta = {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
  explicaciones: string[]; // Explicación para cada opción
};

type ExamenInteractivoProps = {
  preguntas: Pregunta[];
  onComplete?: () => void;
  subtemaSlug?: string; // Nuevo prop para identificar el subtema
};

export default function ExamenInteractivo({ preguntas, onComplete, subtemaSlug }: ExamenInteractivoProps) {
  const storageKey = subtemaSlug ? `examen_respuestas_${subtemaSlug}` : undefined;
  const [seleccionadas, setSeleccionadas] = useState<(number | null)[]>(() => {
    if (storageKey && typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    }
    return Array(preguntas.length).fill(null);
  });

  // Nuevos estados para la mecánica evaluativa
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [calificacion, setCalificacion] = useState<number | null>(null);

  // Guardar en localStorage cada vez que cambian las respuestas
  useEffect(() => {
    if (storageKey && typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(seleccionadas));
    }
  }, [seleccionadas, storageKey]);

  // Verificar si todas las preguntas están respondidas
  const todasRespondidas = seleccionadas.every(sel => sel !== null);

  // Función para comprobar respuestas
  const comprobarRespuestas = () => {
    if (!todasRespondidas) return;
    
    const correctas = seleccionadas.filter((sel, idx) => sel === preguntas[idx].respuestaCorrecta).length;
    const porcentaje = Math.round((correctas / preguntas.length) * 100);
    
    setCalificacion(porcentaje);
    setMostrarResultados(true);

    // Si todas son correctas, llamar a onComplete
    if (correctas === preguntas.length && onComplete) {
      onComplete();
    }
  };

  // Función para reintentar
  const reintentar = () => {
    setSeleccionadas(Array(preguntas.length).fill(null));
    setMostrarResultados(false);
    setCalificacion(null);
    
    // Limpiar localStorage
    if (storageKey && typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <article className="relative p-4 pt-8 pl-8 mt-12 mb-8 border-2 border-white rounded-sm bg-black/30 backdrop-blur-lg">
      <div className="absolute flex items-center justify-center p-1 px-3 text-sm font-bold text-black bg-white rounded-full -top-4 left-7 gap-x-2">
        <svg className="w-6 h-6 text-black" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8"></path><path d="M14 19l2 2l4 -4"></path><path d="M9 8h4"></path><path d="M9 12h2"></path></svg>
        Examen interactivo
      </div>
      
      <div className="flex flex-col gap-y-10">
        {preguntas.map((preg, idx) => (
          <div className="w-full" key={idx}>
            <h5 className="mb-2 text-yellow-400">{preg.pregunta}</h5>
            {preg.opciones.map((op, opIdx) => {
              const seleccionada = seleccionadas[idx] === opIdx;
              const esCorrecta = opIdx === preg.respuestaCorrecta;
              
              // Solo mostrar colores y explicaciones si se han comprobado los resultados
              const mostrarFeedback = mostrarResultados && seleccionada;
              
              return (
                <div
                  key={opIdx}
                  className={clsx(
                    "flex items-center border border-transparent rounded transition-all",
                    mostrarFeedback && esCorrecta && "bg-green-800/20 border-green-400",
                    mostrarFeedback && !esCorrecta && "bg-red-800/20 border-red-400",
                    !mostrarFeedback && seleccionada && "bg-blue-800/20 border-blue-400",
                    !seleccionada && "hover:bg-yellow-200/10 hover:border-yellow-200"
                  )}
                >
                  <label
                    htmlFor={`entry-${idx}-answer-${opIdx}`}
                    className={clsx(
                      "flex flex-row items-center w-full py-4 pl-4 pr-8 font-medium text-gray-300 cursor-pointer gap-x-4",
                      mostrarResultados && "cursor-not-allowed"
                    )}
                  >
                    <input
                      id={`entry-${idx}-answer-${opIdx}`}
                      className="w-4 h-4 text-blue-600"
                      type="radio"
                      name={`entry-${idx}`}
                      checked={seleccionada}
                      disabled={mostrarResultados}
                      onChange={() => {
                        if (!mostrarResultados) {
                          const nuevas = [...seleccionadas];
                          nuevas[idx] = opIdx;
                          setSeleccionadas(nuevas);
                        }
                      }}
                    />
                    <div className="w-full">
                      <span className="w-full">{op}</span>
                      <small
                        className={clsx(
                          "text-base mt-2",
                          mostrarFeedback && esCorrecta && "block text-green-100/90",
                          mostrarFeedback && !esCorrecta && "block text-red-100/90",
                          !mostrarFeedback && "hidden"
                        )}
                      >
                        {mostrarFeedback ? preg.explicaciones[opIdx] : ""}
                      </small>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-white/20">
        {!mostrarResultados ? (
          <button
            onClick={comprobarRespuestas}
            disabled={!todasRespondidas}
            className={clsx(
              "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2",
              todasRespondidas
                ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            )}
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M9 12l2 2l4 -4"></path>
              <path d="M21 12c-1 0 -3 -1 -3 -3s2 -3 3 -3s3 1 3 3s-2 3 -3 3"></path>
              <path d="M3 12c1 0 3 -1 3 -3s-2 -3 -3 -3s-3 1 -3 3s2 3 3 3"></path>
            </svg>
            Comprobar respuestas
          </button>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Mostrar calificación */}
            <div className="text-center p-4 bg-black/40 rounded-lg border border-white/20">
              <div className="text-2xl font-bold text-white mb-2">
                Calificación: {calificacion}%
              </div>
              <div className={clsx(
                "text-lg font-semibold",
                calificacion && calificacion >= 80 ? "text-green-400" : 
                calificacion && calificacion >= 60 ? "text-yellow-400" : "text-red-400"
              )}>
                {calificacion && calificacion >= 80 ? "¡Excelente!" : 
                 calificacion && calificacion >= 60 ? "Bien, pero puedes mejorar" : "Necesitas repasar"}
              </div>
            </div>
            
            {/* Botón de reintentar */}
            <button
              onClick={reintentar}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
              </svg>
              Reintentar
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
