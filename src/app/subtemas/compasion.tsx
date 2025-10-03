import React from "react";

export default function Compasion() {
  return (
    <article id='clase' className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">     {/* Título principal */}
      
      <h1 className="text-4xl font-bold text-yellow-400 mb-8">
        COMPASIÓN
      </h1>

      {/* Objetivo */}
      <section className="p-6 bg-white/5 border border-white/10 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-white mb-3">🎯 Objetivo</h2>
        <p className="text-gray-200">
          Comprender el verdadero sentido de la compasión como motor de la
          solidaridad, no como un gesto superficial, sino como un compromiso
          profundo que transforma tanto al que ayuda como al necesitado.
        </p>
      </section>

      {/* Cuerpo principal */}
      <section className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 italic text-yellow-300">
          “Tuvo compasión…”
        </div>

        <p className="text-gray-200">
          La compasión es un sentimiento divino. Se manifiesta en el proceder de
          Dios.
        </p>
        <p className="text-gray-200">
          Compasión es poner el corazón, es capacidad de indignación. Es igual a
          decir <span className="italic text-yellow-300">¡basta! ¡No más!</span>.
        </p>
        <p className="text-gray-200">
          Compasión es volcar la totalidad de la persona: razón y corazón, hacia
          el que está caído. Es sentir que se revuelven las entrañas ante la
          injusticia.
        </p>

        <p className="text-gray-200">
          La compasión brota de la toma de conciencia, fragua en las opciones
          fundamentales de las personas, emerge de su ética, de su fe, de sus
          experiencias dolorosas aceptadas.
        </p>

        <p className="text-gray-200">
          Compasión es tomar partido por el otro. No es un{" "}
          <span className="italic text-yellow-300">“pobrecito”</span>, sino un
          rechazo activo a la injusticia.
        </p>

        <p className="text-gray-200">
          Compasión no es un impulso momentáneo, sino una actitud que se
          cultiva, un estilo de vida que compromete pensamiento, sentimiento,
          decisiones y acciones.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4 italic text-yellow-300">
          “Una vida sin pasión es un ensayo inútil.”
        </div>

        <p className="text-gray-200">
          La compasión compromete la totalidad de la persona. Es apoyo, ayuda,
          proceso, responsabilidad, opción fundamental e indignación frente a la
          injusticia.
        </p>

        <p className="text-gray-200">
          Dios, cuando vio la esclavitud de los israelitas en Egipto, sintió
          compasión porque se indignó contra el explotador. Jesús, frente a los
          marginados, se compadeció porque detestaba la condición que humilla e
          inutiliza al ser humano.
        </p>

        <p className="text-gray-200">
          La compasión verdadera no es limosna ni apariencia. La compasión sin
          compromiso es disfraz, burla y humillación. La auténtica compasión
          provoca procesos de dignificación.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4 italic text-yellow-300">
          “La compasión al estilo de Jesús es compromiso radical.”
        </div>

        <p className="text-gray-200">
          La compasión va hasta las últimas consecuencias. No se trata de estar
          presente un día y olvidar al siguiente, sino de un proceso constante
          de responsabilidad, compromiso y servicio comunitario.
        </p>
      </section>

      {/* Bloques temáticos */}
      <section className="p-6 bg-white/5 border border-white/10 rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          📚 Bloques Temáticos
        </h2>
        <ul className="list-disc list-inside text-gray-200 space-y-2">
          <li>La compasión como sentimiento divino y vínculo con la justicia.</li>
          <li>Compasión auténtica vs. falsa compasión.</li>
          <li>
            Compasión como proceso, compromiso y opción de vida transformadora.
          </li>
          <li>Relación entre compasión, pasión y transformación personal.</li>
          <li>
            Ejemplos en la fe: Dios y Jesús como modelos de compasión radical.
          </li>
          <li>
            Diferencia entre limosna y solidaridad en la vida cotidiana.
          </li>
        </ul>
      </section>

      {/* Conclusión */}
      <section className="p-6 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
        <h2 className="text-2xl font-semibold text-white mb-3">✨ Conclusión</h2>
        <p className="text-white">
          La compasión no es un sentimiento pasajero, es un compromiso radical
          que transforma realidades. Cuando sentimos con el otro y actuamos en
          consecuencia, sembramos dignidad, justicia y esperanza en la vida de
          quienes más lo necesitan.
        </p>
      </section>
      </div>
    </article>
  );
}
