// src/preguntas/buscando-en-la-oscuridad.ts
import type { Pregunta } from "@/app/ExamenInteractivo";

const preguntas: Pregunta[] = [
  {
    pregunta: "¿Para qué sirven los comentarios?",
    opciones: [
      "Para cambiar el comportamiento de nuestro código",
      "Sirven para documentar nuestro código y explicar qué hace cada parte de él"
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "Falso. Los comentarios no cambian el comportamiento de nuestro código. Sólo sirven para documentarlo",
      "¡Exacto! Buen trabajo."
    ]
  },
  // ...más preguntas
];

export default preguntas;