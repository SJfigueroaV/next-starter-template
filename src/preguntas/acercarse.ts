import type { Pregunta } from "@/app/ExamenInteractivo";

const preguntas: Pregunta[] = [
  {
    pregunta: "¿Cuál es la diferencia entre un acercamiento solidario y el de un simple espectador?",
    opciones: [
      "El espectador se acerca por curiosidad, mientras que el solidario lo hace por compasión y decisión.",
      "No hay diferencia, ambos se acercan con la misma intención.",
      "El espectador ayuda siempre, mientras que el solidario solo observa.",
      "El espectador se aleja inmediatamente después de ver la situación."
    ],
    respuestaCorrecta: 0,
    explicaciones: [
      "¡Correcto! El acercamiento solidario nace de la compasión y la decisión de actuar, mientras que el espectador solo observa por curiosidad.",
      "Incorrecto. Sí hay una diferencia: la intención y la acción distinguen al solidario del espectador.",
      "Incorrecto. En realidad, ocurre al contrario: el solidario ayuda, mientras que el espectador solo observa.",
      "Incorrecto. Aunque el espectador puede alejarse, esa no es la diferencia esencial frente al acercamiento solidario."
    ]
  },
  {
    pregunta: "¿Qué papel juega la libertad en el acercamiento solidario?",
    opciones: [
      "La libertad permite elegir ayudar de manera sincera y comprometida.",
      "No es importante, ya que la solidaridad es una obligación.",
      "La libertad limita la decisión de ayudar porque implica esfuerzo.",
      "La solidaridad no tiene relación con la libertad, sino con la obligación social."
    ],
    respuestaCorrecta: 0,
    explicaciones: [
      "¡Correcto! La libertad es clave porque permite que la solidaridad sea una elección auténtica y responsable.",
      "Incorrecto. La solidaridad pierde su valor cuando se convierte en obligación y no en decisión libre.",
      "Incorrecto. La libertad no limita la solidaridad, al contrario, la hace posible como un acto voluntario.",
      "Incorrecto. La solidaridad sí está estrechamente ligada a la libertad, no solo a la obligación social."
    ]
  },
  {
    pregunta: "¿Por qué no basta con ver y sentir compasión para ser solidario?",
    opciones: [
      "Porque la solidaridad implica una decisión y una acción concreta.",
      "Porque ver y sentir compasión ya es suficiente para ayudar.",
      "Porque la solidaridad solo es válida si es espontánea y sin planificación.",
      "Porque sentir compasión es un acto individual y no colectivo."
    ],
    respuestaCorrecta: 0,
    explicaciones: [
      "¡Correcto! La solidaridad requiere actuar; ver y sentir no son suficientes sin una decisión que se traduzca en ayuda.",
      "Incorrecto. Solo observar o sentir compasión no resuelve la necesidad del otro.",
      "Incorrecto. La solidaridad no depende de ser espontánea, sino de la voluntad de actuar.",
      "Incorrecto. Aunque la compasión es personal, lo que define la solidaridad es la acción que sigue a ese sentimiento."
    ]
  },
  {
    pregunta: "¿Qué significa acercarse de manera dignificante?",
    opciones: [
      "Servir con honestidad, sin buscar beneficios personales ni reconocimiento.",
      "Acercarse solo cuando es conveniente para la propia imagen.",
      "Brindar ayuda de manera esporádica y sin compromiso.",
      "Sentir lástima por la persona necesitada sin actuar."
    ],
    respuestaCorrecta: 0,
    explicaciones: [
      "¡Correcto! El acercamiento dignificante busca servir al otro con autenticidad, sin esperar recompensas.",
      "Incorrecto. Esa actitud convierte la ayuda en interés personal, no en solidaridad genuina.",
      "Incorrecto. La ayuda esporádica sin compromiso no refleja un acercamiento solidario.",
      "Incorrecto. Sentir lástima no basta si no se traduce en una acción de servicio auténtico."
    ]
  },
  {
    pregunta: "¿Cuál es una característica esencial de la solidaridad auténtica?",
    opciones: [
      "Se basa en una decisión consciente, libre y responsable.",
      "Es una acción motivada por la presión social.",
      "Solo se realiza cuando no hay riesgo de perder algo propio.",
      "Se mide por la cantidad de reconocimiento que se recibe."
    ],
    respuestaCorrecta: 0,
    explicaciones: [
      "¡Correcto! La solidaridad auténtica nace de una decisión personal, libre y asumida con responsabilidad.",
      "Incorrecto. La presión social no garantiza un compromiso genuino con el otro.",
      "Incorrecto. La solidaridad no depende de la ausencia de riesgos, sino de la disposición sincera de servir.",
      "Incorrecto. La solidaridad no busca reconocimiento, sino ayudar de manera desinteresada."
    ]
  }
];

export default preguntas;
