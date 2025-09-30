import type { Pregunta } from "@/app/ExamenInteractivo";

const preguntas: Pregunta[] = [
  {
    pregunta: "¿Qué significa realmente aproximarse a una persona en situación de necesidad?",
    opciones: [
      "Darle dinero sin conocer su historia.",
      "Acercarse físicamente, pero sin involucrarse.",
      "Romper barreras y generar un encuentro auténtico.",
      "Sentir lástima por su situación.",
      "Esperar a que la persona pida ayuda."
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "No basta con dar dinero sin involucrarse.",
      "Acercarse físicamente no garantiza un encuentro auténtico.",
      "¡Correcto! Aproximarse implica romper barreras y generar un encuentro real.",
      "Sentir lástima no equivale a aproximarse de manera solidaria.",
      "Esperar a que pidan ayuda no es una verdadera aproximación."
    ]
  },
  {
    pregunta: "¿Cuáles son algunas barreras que impiden la aproximación a los demás?",
    opciones: [
      "Prejuicios religiosos, sociales y culturales.",
      "La falta de dinero para ayudar.",
      "El temor a ser agradecido por el otro.",
      "La obligación de seguir las normas de la sociedad.",
      "La falta de tiempo para involucrarse en la vida de otros."
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "¡Correcto! Los prejuicios religiosos, sociales y culturales dificultan acercarse al otro.",
      "La falta de dinero no es la barrera principal.",
      "El temor a ser agradecido no aplica.",
      "Seguir normas sociales no necesariamente impide aproximarse.",
      "La falta de tiempo no es la barrera más relevante."
    ]
  },
  {
    pregunta: "¿Cómo podemos reducir la distancia con los más vulnerables?",
    opciones: [
      "Reconociendo que el sufrimiento es un lenguaje común.",
      "Evitando cualquier relación con ellos para no incomodarlos.",
      "Pensando que es responsabilidad del gobierno ayudar.",
      "Solo apoyando con donaciones sin contacto personal.",
      "Limitando la solidaridad a fechas especiales como Navidad."
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "¡Correcto! Reconocer que el sufrimiento es un lenguaje común ayuda a reducir la distancia.",
      "Evitar relación no reduce la distancia.",
      "Delegar en el gobierno no genera cercanía.",
      "Solo donar sin contacto no reduce la separación.",
      "Limitar la solidaridad a fechas especiales no es suficiente."
    ]
  },
  {
    pregunta: "¿Qué implica la aproximación como un acto de desprendimiento?",
    opciones: [
      "Dar sin esperar nada a cambio.",
      "Ayudar solo cuando nos conviene.",
      "Calcular cuántas personas podemos asistir sin afectar nuestra comodidad.",
      "Pensar en la recompensa que podríamos recibir después.",
      "Sentirnos moralmente superiores a los demás."
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "¡Correcto! Aproximarse como acto de desprendimiento significa dar sin esperar nada a cambio.",
      "No se trata de ayudar solo por conveniencia.",
      "No consiste en calcular beneficios propios.",
      "No es pensar en recompensas futuras.",
      "No se trata de sentirse moralmente superior."
    ]
  },
  {
    pregunta: "¿Cómo se manifiesta la ceguera ante la necesidad del otro?",
    opciones: [
      "Al ignorar el sufrimiento de quienes nos rodean.",
      "Al sentir empatía por los demás.",
      "Al ofrecer ayuda sin conocer la historia de la persona.",
      "Al asumir que cada quien debe resolver sus propios problemas.",
      "Al involucrarnos en la comunidad sin esperar reconocimiento."
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "¡Correcto! Ignorar el sufrimiento de quienes nos rodean es una forma de ceguera social.",
      "Sentir empatía no es ceguera.",
      "Ayudar sin conocer la historia no es lo que se llama ceguera.",
      "Asumir responsabilidad individual no es ceguera ante otros.",
      "Involucrarse sin esperar recompensa no es ceguera."
    ]
  }
];

export default preguntas;
