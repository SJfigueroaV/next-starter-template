"use client";
import { useState } from "react";

export type Pregunta = {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number; // índice de la opción correcta
  explicacion: string;
};

type ExamenInteractivoProps = {
  preguntas: Pregunta[];
};

export default function ExamenInteractivo({ preguntas }: ExamenInteractivoProps) {
  const [seleccionadas, setSeleccionadas] = useState<(number | null)[]>(Array(preguntas.length).fill(null));

  const handleSeleccion = (idxPregunta: number, idxOpcion: number) => {
    const nuevas = [...seleccionadas];
    nuevas[idxPregunta] = idxOpcion;
    setSeleccionadas(nuevas);
  };

  return (
    <div className="p-4 border rounded-lg border-white/30 bg-black/40 mb-8">
      <div className="mb-4 font-bold text-white text-lg">
        <span role="img" aria-label="libro">📖</span> Examen interactivo
      </div>
      {preguntas.map((preg, idx) => (
        <div key={idx} className="mb-6">
          <div className="mb-2 text-yellow-300 font-bold text-xl">{preg.pregunta}</div>
          {preg.opciones.map((op, opIdx) => (
            <div key={opIdx} className="mb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={`pregunta-${idx}`}
                  checked={seleccionadas[idx] === opIdx}
                  onChange={() => handleSeleccion(idx, opIdx)}
                  className="accent-yellow-400"
                />
                <span className="text-white">{op}</span>
              </label>
            </div>
          ))}
          {seleccionadas[idx] !== null && (
            <div className={`mt-2 p-3 rounded ${seleccionadas[idx] === preg.respuestaCorrecta ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}>
              {seleccionadas[idx] === preg.respuestaCorrecta
                ? (
                  <>
                    {preg.opciones[preg.respuestaCorrecta]}
                    <br />
                    {preg.explicacion}
                  </>
                )
                : "Respuesta incorrecta. Intenta de nuevo."}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
