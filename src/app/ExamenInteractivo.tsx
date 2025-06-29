"use client";
import { useState } from "react";
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
};

export default function ExamenInteractivo({ preguntas, onComplete }: ExamenInteractivoProps) {
  const [seleccionadas, setSeleccionadas] = useState<(number | null)[]>(Array(preguntas.length).fill(null));

  // Llama a onComplete si todas las respuestas son correctas y respondidas
  if (
    onComplete &&
    seleccionadas.every((sel, idx) => sel === preguntas[idx].respuestaCorrecta) &&
    seleccionadas.every(sel => sel !== null)
  ) {
    onComplete();
  }

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
              const yaRespondio = seleccionadas[idx] !== null;
              return (
                <div
                  key={opIdx}
                  className={clsx(
                    "flex items-center border border-transparent rounded transition-all",
                    seleccionada && esCorrecta && "bg-green-800/20 border-green-400",
                    seleccionada && !esCorrecta && "bg-red-800/20 border-red-400",
                    !seleccionada && "hover:bg-yellow-200/10 hover:border-yellow-200"
                  )}
                >
                  <label
                    htmlFor={`entry-${idx}-answer-${opIdx}`}
                    className={clsx(
                      "flex flex-row items-center w-full py-4 pl-4 pr-8 font-medium text-gray-300 cursor-pointer gap-x-4",
                      seleccionada && esCorrecta && "pointer-events-none",
                      seleccionada && !esCorrecta && "pointer-events-none"
                    )}
                  >
                    <input
                      id={`entry-${idx}-answer-${opIdx}`}
                      className={clsx(
                        "w-4 h-4 text-blue-600",
                        (seleccionada && esCorrecta) || (seleccionada && !esCorrecta) ? "pointer-events-none" : ""
                      )}
                      type="radio"
                      name={`entry-${idx}`}
                      checked={seleccionada}
                      onChange={() => {
                        if (!yaRespondio) {
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
                          seleccionada && esCorrecta && "block text-green-100/90",
                          seleccionada && !esCorrecta && "block text-red-100/90",
                          (!seleccionada || !yaRespondio) && "hidden"
                        )}
                      >
                        {seleccionada ? preg.explicaciones[opIdx] : ""}
                      </small>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </article>
  );
}
