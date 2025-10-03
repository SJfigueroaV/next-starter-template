// src/data/preguntasCompasion.ts
import type { Pregunta } from "@/app/ExamenInteractivo";

const preguntas: Pregunta[] = [
  {
    pregunta: "¿Qué significa tener compasión según el texto?",
    opciones: [
      "Sentir lástima por el necesitado.",
      "Un sentimiento momentáneo de tristeza.",
      "Poner el corazón y comprometerse con el otro.",
      "Dar limosna para aliviar la conciencia."
    ],
    respuestaCorrecta: 2,
    explicaciones: [
      "No, la compasión no es solo lástima.",
      "Incorrecto, no es algo pasajero.",
      "¡Correcto! Compasión es poner el corazón y comprometerse.",
      "Dar limosna sin compromiso no es compasión auténtica."
    ]
  },
  {
    pregunta: "¿Cuál es la diferencia entre la compasión auténtica y la falsa compasión?",
    opciones: [
      "La compasión auténtica genera procesos de dignificación, mientras que la falsa es solo un gesto superficial.",
      "La compasión auténtica es ayudar con dinero, mientras que la falsa solo es dar consejos.",
      "No hay diferencia, toda compasión es válida.",
      "La compasión falsa se da solo en la religión, la auténtica en la política."
    ],
    respuestaCorrecta: 0,
    explicaciones: [
      "¡Correcto! La auténtica transforma vidas, la falsa solo aparenta.",
      "No, no se limita al dinero.",
      "Incorrecto, sí hay diferencia entre ambas.",
      "La compasión no se divide entre religión y política."
    ]
  },
  {
    pregunta: "¿Por qué la compasión implica indignación?",
    opciones: [
      "Porque nos hace sentir mal al ver el sufrimiento ajeno.",
      "Porque nos lleva a decir “¡basta!” ante la injusticia.",
      "Porque genera odio contra los opresores.",
      "Porque nos obliga a actuar sin reflexionar."
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "No basta solo con sentirse mal.",
      "¡Correcto! La compasión se convierte en indignación frente a la injusticia.",
      "No se trata de odio, sino de justicia.",
      "La compasión auténtica siempre implica reflexión y compromiso."
    ]
  },
  {
    pregunta: "¿Cómo se cultiva la compasión en la vida cotidiana?",
    opciones: [
      "A través de la práctica constante del servicio a los demás.",
      "Sintiendo pena por los menos afortunados.",
      "Dando limosna cada vez que sea necesario.",
      "Esperando que otros se ocupen de los problemas sociales."
    ],
    respuestaCorrecta: 0,
    explicaciones: [
      "¡Correcto! La compasión se cultiva con servicio constante.",
      "No, sentir pena no transforma la realidad.",
      "Dar limosna no siempre implica compasión auténtica.",
      "La compasión no espera, actúa."
    ]
  },
  {
    pregunta: "¿Cuál es el papel de la compasión en los procesos comunitarios?",
    opciones: [
      "Es un sentimiento pasajero que no influye en la comunidad.",
      "Ayuda a que las personas se sientan bien sin necesidad de actuar.",
      "Es la base del compromiso, la responsabilidad y el servicio.",
      "Solo tiene valor en las religiones, no en la vida social."
    ],
    respuestaCorrecta: 2,
    explicaciones: [
      "No, no es pasajera, es transformadora.",
      "La compasión exige acción, no solo sentirse bien.",
      "¡Correcto! Es la base del compromiso y servicio comunitario.",
      "No, la compasión también es clave en lo social y comunitario."
    ]
  }
];

export default preguntas;
