import type { Pregunta } from "@/app/ExamenInteractivo";

const preguntas: Pregunta[] = [
  {
    pregunta: "¿Qué aspectos de su vida entregó el Samaritano para ayudar al hombre caído?",
    opciones: [
      "Solo su tiempo",
      "Solo su dinero",
      "Su tiempo, conocimiento y recursos económicos",
      "Nada, solo le dio unas palabras de aliento"
    ],
    respuestaCorrecta: 2,
    explicaciones: [
      "Incorrecto. Solo entregar tiempo no refleja la totalidad de su ayuda.",
      "Incorrecto. Solo entregar dinero no sería suficiente para la solidaridad demostrada.",
      "¡Correcto! El Samaritano entregó tiempo, conocimiento y recursos económicos.",
      "Incorrecto. No se limitó a palabras; actuó con compromiso completo."
    ]
  },
  {
    pregunta: "Según la enseñanza de Jesús, ¿cuál es la verdadera recompensa de la solidaridad?",
    opciones: [
      "Ser reconocido por la comunidad",
      "La vida eterna",
      "Recibir ayuda cuando se necesite",
      "Un sentimiento de satisfacción personal"
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "Incorrecto. La solidaridad no busca reconocimiento humano.",
      "¡Correcto! Jesús enseña que la verdadera recompensa es la vida eterna.",
      "Incorrecto. La solidaridad no se mide por recibir ayuda a cambio.",
      "Incorrecto. El sentimiento personal no es la recompensa principal según Jesús."
    ]
  },
  {
    pregunta: "¿Por qué el Samaritano involucró al posadero en el proceso de ayuda?",
    opciones: [
      "Porque no quería seguir cuidando del herido",
      "Para asegurarse de que el hombre caído recibiera atención continua",
      "Porque el posadero le debía un favor",
      "Para demostrar su generosidad a los demás"
    ],
    respuestaCorrecta: 0,
    explicaciones: [
      "Incorrecto. No se trató de evadir responsabilidad.",
      "¡Correcto! Involucró al posadero para garantizar atención continua al hombre caído.",
      "Incorrecto. No se basó en deudas o favores previos.",
      "Incorrecto. Su intención no era demostrar generosidad a terceros."
    ]
  },
  {
    pregunta: "¿Cómo se puede describir el efecto multiplicador de la solidaridad?",
    opciones: [
      "Un acto solidario puede inspirar a otros a ayudar",
      "Solo quienes reciben ayuda pueden ser solidarios después",
      "La solidaridad solo funciona si hay una recompensa",
      "Ayudar a otros hace que las personas sean más ricas"
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "¡Correcto! Un solo acto solidario puede inspirar a otros a actuar de manera similar.",
      "Incorrecto. No solo los receptores se ven inspirados; también observadores pueden contagiarse.",
      "Incorrecto. La solidaridad no depende de una recompensa material.",
      "Incorrecto. Ayudar no se mide en riqueza material."
    ]
  },
  {
    pregunta: "¿Qué muestra la experiencia pastoral sobre la solidaridad?",
    opciones: [
      "Que siempre se necesita dinero para ayudar",
      "Que la solidaridad obliga a las personas a actuar",
      "Que muchas personas terminan dando más de lo esperado cuando son conmovidas",
      "Que solo los más ricos pueden ser realmente solidarios"
    ],
    respuestaCorrecta: 2,
    explicaciones: [
      "Incorrecto. No siempre se requiere dinero; el compromiso personal es clave.",
      "Incorrecto. La solidaridad no obliga, sino que inspira.",
      "¡Correcto! La experiencia muestra que la mayoría da más de lo esperado cuando se conmueve su corazón.",
      "Incorrecto. La riqueza no define la capacidad de ser solidario."
    ]
  }
];

export default preguntas;
