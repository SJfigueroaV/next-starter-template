import type { Pregunta } from "@/app/ExamenInteractivo";

const preguntas: Pregunta[] = [
  {
    pregunta: "¿Por qué el samaritano es un personaje inesperado en la historia?",
    opciones: [
      "Porque era un extranjero con muchos bienes.",
      "Porque no pertenecía al grupo de los elegidos y era marginado.",
      "Porque tenía un cargo religioso importante.",
      "Porque vivía en Jerusalén y era influyente.",
      "Porque era un líder político de la época."
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "No es correcto, aunque era extranjero, no se menciona que tuviera muchos bienes.",
      "¡Correcto! Era marginado y no pertenecía al grupo de los elegidos.",
      "No tenía un cargo religioso importante.",
      "No era influyente en Jerusalén.",
      "No era un líder político de la época."
    ]
  },
  {
    pregunta: "¿Qué demuestra la solidaridad que proviene de la periferia y la exclusión?",
    opciones: [
      "Que Dios prefiere a los poderosos.",
      "Que solo las personas pobres pueden ser solidarias.",
      "Que Dios actúa a través de quienes la sociedad rechaza.",
      "Que la solidaridad solo se encuentra dentro de los templos religiosos.",
      "Que la fe verdadera depende de la riqueza."
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "Dios no prefiere a los poderosos.",
      "No significa que solo los pobres sean solidarios.",
      "¡Correcto! Dios actúa por medio de los rechazados por la sociedad.",
      "No se limita a los templos religiosos.",
      "La fe verdadera no depende de la riqueza."
    ]
  },
  {
    pregunta: "¿Por qué es difícil que los ricos practiquen la solidaridad?",
    opciones: [
      "Porque no saben cómo ayudar a los demás.",
      "Porque la solidaridad solo ocurre entre los que sufren juntos.",
      "Porque están muy ocupados con sus asuntos.",
      "Porque a menudo esperan algo a cambio de sus acciones.",
      "Porque no creen en la importancia de la ayuda mutua."
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "No es que no sepan cómo ayudar.",
      "La solidaridad no se limita a quienes sufren juntos.",
      "La ocupación no es la razón principal.",
      "¡Correcto! Muchas veces esperan algo a cambio de sus acciones.",
      "No se trata de incredulidad en la ayuda mutua."
    ]
  },
  {
    pregunta: "Según el texto, ¿qué papel juega Dios en la transformación del ser humano?",
    opciones: [
      "Dios toca el corazón para que la persona salga de sí misma y ayude a los demás.",
      "Dios solo actúa en los templos religiosos.",
      "Dios premia únicamente a quienes cumplen la ley.",
      "Dios solo interviene en los asuntos espirituales.",
      "Dios obliga a las personas a ser solidarias."
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "¡Correcto! Dios toca el corazón y mueve a la persona a ayudar.",
      "No se limita a los templos religiosos.",
      "No premia solo a quienes cumplen la ley.",
      "No interviene solo en lo espiritual.",
      "No obliga a las personas a ser solidarias."
    ]
  },
  {
    pregunta: "¿Qué ejemplos menciona el texto sobre la solidaridad más allá de lo material?",
    opciones: [
      "La donación de grandes riquezas.",
      "El poder político como medio para ayudar.",
      "La entrega de tierras y bienes inmuebles.",
      "Una sonrisa, el tiempo para escuchar y la amabilidad.",
      "La educación exclusiva para los pobres."
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "No se trata solo de donar grandes riquezas.",
      "No menciona el poder político como ayuda.",
      "No se refiere a bienes inmuebles.",
      "¡Correcto! Una sonrisa, el tiempo y la amabilidad son solidaridad real.",
      "No habla de educación exclusiva para pobres."
    ]
  }
];

export default preguntas;
