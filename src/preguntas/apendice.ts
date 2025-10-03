import type { Pregunta } from "@/app/ExamenInteractivo";

const preguntas: Pregunta[] = [
  {
    pregunta: "¿Cómo podemos fomentar una cultura de compartir, incluso en momentos de escasez, para fortalecer la solidaridad en nuestra comunidad?",
    opciones: [
      "Guardando nuestros recursos solo para tiempos difíciles.",
      "Esperando a que otros sean los primeros en compartir.",
      "Generando conciencia sobre el impacto del compartir y dando ejemplo con nuestras acciones.",
      "Depender únicamente de ayudas externas para cubrir necesidades."
    ],
    respuestaCorrecta: 2,
    explicaciones: [
      "Incorrecto. Guardar recursos solo para uno mismo no fomenta la solidaridad.",
      "Incorrecto. Esperar a que otros actúen no promueve la iniciativa solidaria.",
      "¡Correcto! Ser un ejemplo y generar conciencia fortalece la cultura de compartir.",
      "Incorrecto. Depender de otros no crea hábitos solidarios ni conciencia comunitaria."
    ]
  },
  {
    pregunta: "¿Cuáles son las señales que nos permiten identificar una necesidad urgente y cómo podemos actuar con prontitud para atenderla?",
    opciones: [
      "Ignorar la situación hasta que alguien más la resuelva.",
      "Estar atentos a nuestro entorno, sensibilizarnos y buscar soluciones concretas.",
      "Criticar a quienes no hacen nada y esperar cambios.",
      "Pensar que siempre hay alguien en peores condiciones y minimizar el problema."
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "Incorrecto. Ignorar la necesidad no ayuda a nadie y retrasa la solidaridad.",
      "¡Correcto! La atención y acción inmediata frente a necesidades promueve la solidaridad efectiva.",
      "Incorrecto. Criticar sin actuar no resuelve la situación.",
      "Incorrecto. Minimizar problemas impide que se brinde ayuda concreta."
    ]
  },
  {
    pregunta: "¿Por qué tendemos a delegar la responsabilidad de resolver problemas en lugar de asumir un papel activo en la solución?",
    opciones: [
      "Porque creemos que otros tienen más recursos o poder para hacerlo.",
      "Porque sentimos que no podemos hacer la diferencia.",
      "Porque la comodidad y la indiferencia nos llevan a evadir el compromiso.",
      "Todas las anteriores."
    ],
    respuestaCorrecta: 3,
    explicaciones: [
      "Correcto parcialmente, pero hay otros factores que también influyen.",
      "Correcto parcialmente, pero hay otros factores que también influyen.",
      "Correcto parcialmente, pero hay otros factores que también influyen.",
      "¡Correcto! Todos estos factores contribuyen a delegar responsabilidades en lugar de actuar."
    ]
  },
  {
    pregunta: "¿Cómo podemos superar el miedo a la insuficiencia y confiar en que cuando compartimos, lo poco puede alcanzar para todos?",
    opciones: [
      "Esperando a tener más para entonces poder ayudar.",
      "Compartiendo solo cuando estamos seguros de que no nos hará falta.",
      "Confiando en la generosidad y en que cuando todos aportan, se logra el bienestar común.",
      "Evitando compartir para no correr riesgos."
    ],
    respuestaCorrecta: 2,
    explicaciones: [
      "Incorrecto. Esperar a tener más retrasa la acción solidaria.",
      "Incorrecto. Actuar solo cuando es seguro limita la solidaridad.",
      "¡Correcto! Confiar en la generosidad colectiva permite que incluso lo poco sea suficiente.",
      "Incorrecto. Evitar compartir no fomenta la solidaridad ni la comunidad."
    ]
  },
  {
    pregunta: "¿De qué manera la solidaridad contribuye a la construcción de una comunidad más unida y comprometida con el bienestar colectivo?",
    opciones: [
      "Generando dependencia de quienes reciben ayuda.",
      "Permitiendo que unos pocos carguen con toda la responsabilidad.",
      "Creando lazos de confianza, cooperación y empatía entre los miembros de la comunidad.",
      "Haciendo que solo ciertas personas se beneficien mientras otras no participan."
    ],
    respuestaCorrecta: 2,
    explicaciones: [
      "Incorrecto. La solidaridad no debe generar dependencia, sino empoderar.",
      "Incorrecto. Cargar con toda la responsabilidad no fomenta la cooperación comunitaria.",
      "¡Correcto! La solidaridad fortalece vínculos de confianza y cooperación en la comunidad.",
      "Incorrecto. La solidaridad busca participación inclusiva, no beneficios selectivos."
    ]
  }
];

export default preguntas;
