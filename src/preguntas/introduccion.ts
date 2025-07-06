import type { Pregunta } from "@/app/ExamenInteractivo";

const preguntas: Pregunta[] = [
  {
    pregunta: "¿Según el texto, quién es el único que puede santificar por completo al ser humano?",
    opciones: [
      "La iglesia y sus enseñanzas",
      "Dios, quien tiene el poder de santificar completamente",
      "La propia disciplina y esfuerzo personal",
      "Los rituales religiosos y las buenas obras",
      "Los líderes espirituales con su guía"
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "Falso. La iglesia y sus enseñanzas son importantes, pero no tienen el poder de santificar completamente",
      "¡Exacto! Solo Dios tiene el poder de santificar completamente al ser humano",
      "Falso. La disciplina personal es valiosa, pero no es suficiente para la santificación completa",
      "Falso. Los rituales y obras son importantes, pero no son suficientes para la santificación completa",
      "Falso. Los líderes espirituales pueden guiar, pero no tienen el poder de santificar"
    ]
  },
  {
    pregunta: "¿Qué aspectos del ser humano deben ser transformados en el proceso de santificación?",
    opciones: [
      "Solo el espíritu",
      "La mente y las emociones",
      "Espíritu, alma y cuerpo",
      "Los hábitos y costumbres externas",
      "Solo el alma, pues el cuerpo es corruptible"
    ],
    respuestaCorrecta: 2,
    explicaciones: [
      "Falso. La transformación debe ser integral, no solo espiritual",
      "Falso. La transformación va más allá de mente y emociones",
      "¡Correcto! La santificación debe abarcar espíritu, alma y cuerpo",
      "Falso. No solo los hábitos externos, sino toda la persona",
      "Falso. El cuerpo también debe ser transformado en el proceso"
    ]
  },
  {
    pregunta: "¿Por qué el esfuerzo humano por alcanzar la santidad es insuficiente?",
    opciones: [
      "Porque la santidad es solo para unos pocos escogidos",
      "Porque la naturaleza humana caída no puede generar una transformación espiritual sin Dios",
      "Porque la sociedad no permite cambios genuinos",
      "Porque no existen métodos efectivos de cambio personal",
      "Porque la humanidad está destinada a permanecer en su condición actual"
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "Falso. La santidad está disponible para todos los creyentes",
      "¡Exacto! La naturaleza humana caída necesita la intervención divina",
      "Falso. La sociedad no es el factor determinante",
      "Falso. Existen métodos, pero no son suficientes sin Dios",
      "Falso. La humanidad puede ser transformada con la ayuda de Dios"
    ]
  },
  {
    pregunta: "¿Qué se necesita para que la transformación sea auténtica y duradera según el texto?",
    opciones: [
      "Seguir normas religiosas estrictamente",
      "Hacer obras de caridad constantemente",
      "Incorporar a Dios en la vida para que Él genere el proceso de cambio desde el interior",
      "Practicar la meditación y el autocontrol",
      "Tener una mentalidad positiva y decretar lo que se desea"
    ],
    respuestaCorrecta: 2,
    explicaciones: [
      "Falso. Las normas religiosas son importantes, pero no generan transformación",
      "Falso. Las obras de caridad son buenas, pero no son la fuente de transformación",
      "¡Correcto! Solo Dios puede generar una transformación auténtica desde el interior",
      "Falso. La meditación y autocontrol son herramientas, pero no la fuente",
      "Falso. La mentalidad positiva es útil, pero no es suficiente"
    ]
  },
  {
    pregunta: "¿Cómo se relaciona el proceso de santificación con la segunda venida de Jesús?",
    opciones: [
      "Es un requisito para obtener prosperidad y éxito en la vida",
      "Es la manera de prepararse para recibir a Cristo de forma irreprensible",
      "Solo afecta a ciertos creyentes comprometidos",
      "No tiene relación con la venida de Cristo, sino con la paz interior",
      "Es una tradición que la iglesia ha mantenido por siglos"
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "Falso. No se trata de prosperidad material, sino espiritual",
      "¡Exacto! La santificación nos prepara para recibir a Cristo irreprensiblemente",
      "Falso. Afecta a todos los creyentes, no solo a algunos",
      "Falso. Tiene una relación directa con la venida de Cristo",
      "Falso. No es solo una tradición, sino un proceso espiritual real"
    ]
  },
  {
    pregunta: "¿Qué propósito tiene el recorrido de 40 encuentros basado en la Biblia?",
    opciones: [
      "Analizar profecías sobre el fin de los tiempos",
      "Mostrar diferentes interpretaciones de la Biblia",
      "Guiar a los lectores en un proceso de transformación espiritual",
      "Proporcionar conocimientos teológicos avanzados",
      "Enseñar sobre la historia del pueblo de Israel"
    ],
    respuestaCorrecta: 2,
    explicaciones: [
      "Falso. No se centra en profecías del fin de los tiempos",
      "Falso. No se trata de diferentes interpretaciones",
      "¡Correcto! El propósito es guiar en la transformación espiritual",
      "Falso. No es solo conocimiento teológico, sino transformación práctica",
      "Falso. No se enfoca en la historia de Israel"
    ]
  },
  {
    pregunta: "¿Qué papel juega la Biblia en el proceso de cambio del creyente?",
    opciones: [
      "Es un libro de referencia cultural para la fe",
      "Es una opción más entre varias guías espirituales",
      "Su valor radica solo en su importancia histórica",
      "Es la fuente de enseñanza que revela el diseño de Dios para la humanidad",
      "Sirve solo como inspiración en momentos difíciles"
    ],
    respuestaCorrecta: 3,
    explicaciones: [
      "Falso. No es solo referencia cultural, sino guía espiritual",
      "Falso. No es una opción más, sino la guía principal",
      "Falso. Su valor va más allá de lo histórico",
      "¡Exacto! La Biblia revela el diseño de Dios para la humanidad",
      "Falso. Sirve para más que solo inspiración en momentos difíciles"
    ]
  },
  {
    pregunta: "¿Por qué se recomienda leer varias veces cada reflexión del libro?",
    opciones: [
      "Porque es un requisito obligatorio para los creyentes",
      "Para captar mejor el sentido del texto y su enseñanza",
      "Para cumplir con una rutina de lectura establecida",
      "Porque las Escrituras son difíciles de entender",
      "Para memorizar cada palabra y poder recitarla"
    ],
    respuestaCorrecta: 1,
    explicaciones: [
      "Falso. No es un requisito obligatorio, sino una recomendación",
      "¡Correcto! La relectura ayuda a captar mejor el sentido y enseñanza",
      "Falso. No es solo cumplir una rutina, sino profundizar en el contenido",
      "Falso. No es porque sean difíciles, sino para profundizar",
      "Falso. No se trata de memorizar, sino de comprender"
    ]
  },
  {
    pregunta: "¿Cómo se refleja la santificación en la vida diaria de un creyente?",
    opciones: [
      "En su conocimiento profundo de textos religiosos",
      "En la cantidad de oraciones que realiza diariamente",
      "En su nivel de participación en actividades de la iglesia",
      "En su forma de vivir, demostrando paz y transformación en todas sus acciones",
      "En la forma en que se viste y habla en público"
    ],
    respuestaCorrecta: 3,
    explicaciones: [
      "Falso. No es solo conocimiento, sino aplicación práctica",
      "Falso. No se trata de cantidad de oraciones, sino de transformación",
      "Falso. No es solo participación en actividades, sino transformación personal",
      "¡Exacto! La santificación se refleja en toda la forma de vivir",
      "Falso. No es solo apariencia externa, sino transformación interna"
    ]
  },
  {
    pregunta: "¿De qué manera una persona transformada puede ser una bendición para otros?",
    opciones: [
      "Demostrando su conocimiento teológico a través de debates",
      "Aislándose del mundo para mantenerse puro",
      "Siendo un testimonio vivo que inspire a otros con su ejemplo",
      "Haciendo sacrificios constantes para demostrar su compromiso",
      "Imponiendo su fe y creencias a los demás"
    ],
    respuestaCorrecta: 2,
    explicaciones: [
      "Falso. No es demostrar conocimiento, sino vivir la transformación",
      "Falso. No es aislarse, sino ser luz en el mundo",
      "¡Correcto! El testimonio vivo es la mejor forma de bendecir a otros",
      "Falso. No es hacer sacrificios para demostrar, sino vivir naturalmente transformado",
      "Falso. No se trata de imponer, sino de inspirar"
    ]
  }
];

export default preguntas;