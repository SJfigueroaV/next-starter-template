import type { Pregunta } from "@/app/ExamenInteractivo";

const preguntas: Pregunta[] = [
  {
    pregunta: "¿Qué significa realmente \"ver\" en el contexto de la solidaridad?",
    opciones: [
      "Tomar conciencia de la situación del otro y actuar en consecuencia.",
      "Simplemente observar lo que ocurre sin involucrarse.",
      "Identificar problemas, pero dejar que otros los resuelvan.",
      "Percibir la necesidad, pero no cambiar nuestra rutina."
    ],
    respuestaCorrecta: 0,
    explicaciones: [
      "¡Correcto! Ver implica conciencia y acción solidaria.",
      "Observar sin involucrarse no es solidaridad.",
      "Identificar sin actuar no genera transformación.",
      "Percibir sin cambiar nuestra rutina es indiferencia."
    ]
  },
  {
    pregunta: "¿Cuál de estos factores puede impedirnos ver con el corazón y la conciencia la realidad del necesitado?",
    opciones: [
      "El egoísmo y la indiferencia.",
      "La preocupación exclusiva por el bienestar personal.",
      "La falta de empatía y sensibilidad.",
      "Todas las anteriores."
    ],
    respuestaCorrecta: 3,
    explicaciones: [
      "Es cierto, el egoísmo y la indiferencia ciegan el corazón.",
      "También la preocupación solo por uno mismo nos impide ver al otro.",
      "La falta de empatía nos hace insensibles.",
      "¡Correcto! Todas las anteriores impiden ver con solidaridad."
    ]
  },
  {
    pregunta: "¿Cómo puede la autoobservación contribuir a una mayor solidaridad?",
    opciones: [
      "Permite identificar nuestras reacciones y prejuicios para cambiarlos.",
      "Nos ayuda a ser más críticos con los errores de los demás.",
      "Nos hace ver que nuestra manera de pensar es la correcta.",
      "Nos aleja de la realidad para enfocarnos en nosotros mismos."
    ],
    respuestaCorrecta: 0,
    explicaciones: [
      "¡Correcto! La autoobservación ayuda a mejorar nuestra empatía.",
      "No se trata de criticar, sino de reflexionar sobre uno mismo.",
      "No se busca justificar lo que ya pensamos.",
      "No debe alejarnos de la realidad, sino acercarnos a ella."
    ]
  },
  {
    pregunta: "¿Por qué es importante diferenciar la solidaridad del asistencialismo y el paternalismo?",
    opciones: [
      "Porque la solidaridad busca empoderar y dignificar, mientras que el asistencialismo genera dependencia.",
      "Porque el asistencialismo y el paternalismo siempre son negativos.",
      "Porque solo los gobiernos pueden aplicar el asistencialismo.",
      "Porque la solidaridad no requiere acciones concretas."
    ],
    respuestaCorrecta: 0,
    explicaciones: [
      "¡Correcto! La solidaridad dignifica, el asistencialismo depende.",
      "No siempre son negativos, el problema es cuando generan dependencia.",
      "No solo los gobiernos aplican asistencialismo.",
      "La solidaridad siempre requiere acciones reales."
    ]
  },
  {
    pregunta: "¿Cómo puede influir la dirección de la mirada de los gobernantes en la construcción de una sociedad más justa?",
    opciones: [
      "Definiendo políticas que favorezcan a los más vulnerables.",
      "Diseñando programas sociales que realmente respondan a las necesidades de la población.",
      "Promoviendo una cultura de empatía y compromiso con la justicia social.",
      "Todas las anteriores."
    ],
    respuestaCorrecta: 3,
    explicaciones: [
      "Sí, las políticas públicas deben favorecer a los vulnerables.",
      "Sí, también es necesario que los programas sociales sean efectivos.",
      "Cierto, la cultura de empatía es clave.",
      "¡Correcto! Todas estas acciones son necesarias para una sociedad justa."
    ]
  }
];

export default preguntas;
