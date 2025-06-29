"use client";

import ExamenInteractivo, { Pregunta } from "@/app/ExamenInteractivo";

const preguntas: Pregunta[] = [
  {
    pregunta: "¿Qué significa buscar en la oscuridad?",
    opciones: [
      "Buscar algo sin tener ninguna esperanza.",
      "Buscar respuestas o sentido en momentos difíciles o de incertidumbre."
    ],
    respuestaCorrecta: 1,
    explicacion: "¡Correcto! A veces en la vida pasamos por momentos de oscuridad, pero seguimos buscando respuestas o esperanza."
  },
  {
    pregunta: "¿Qué actitud es importante al buscar en la oscuridad?",
    opciones: [
      "Rendirse rápidamente.",
      "Mantener la fe y la perseverancia."
    ],
    respuestaCorrecta: 1,
    explicacion: "¡Exacto! La fe y la perseverancia nos ayudan a encontrar luz incluso en los momentos más difíciles."
  }
];

export default function SubtemaEspecial() {
  return (
    <div style={{ background: "#222", minHeight: "100vh", padding: "2rem" }}>
      <h1 style={{ color: "#FFD700", fontSize: "2.5rem" }}>
        ¡Este es un subtema especial!
      </h1>
      <p style={{ color: "#FFF", fontSize: "1.2rem" }}>
        Aquí puedes personalizar el contenido, los colores, imágenes, y todo lo que quieras solo para este subtema.
      </p>
      <ExamenInteractivo preguntas={preguntas} />
    </div>
  );
}