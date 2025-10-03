import React from "react";

const ApendiceSolidaridad: React.FC = () => {
  return (
    <article id="clase" className="block min-h-screen">
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      {/* Título principal */}
      <h1 className="text-4xl font-bold text-yellow-400 mb-8">
        Apéndice: La Solidaridad se Construye desde la Escasez
      </h1>

      {/* Sección Objetivo */}
      <section className="p-6 bg-gray-800/60 border border-white/10 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Objetivo</h2>
        <p>
          Reflexionar sobre cómo la solidaridad surge de lo poco que compartimos y cómo se activa al identificar necesidades y responder con generosidad.
        </p>
      </section>

      {/* Párrafos explicativos y citas */}
      <section className="space-y-6">
        <p>
          La solidaridad se construye desde la escasez que se comparte.
        </p>

        <div className="p-4 bg-yellow-900/30 border border-white/10 rounded-lg italic text-yellow-300">
          “13Oyéndolo Jesús, se apartó de allí en una barca a un lugar desierto y apartado; y cuando la gente lo oyó, le siguió a pie desde las ciudades. 14Y saliendo Jesús, vio una gran multitud, y tuvo compasión de ellos, y sanó a los que de ellos estaban enfermos. 15Cuando anochecía, se acercaron a él sus discípulos, diciendo: El lugar es desierto, y la hora ya pasada; despide a la multitud, para que vayan por las aldeas y compren de comer. 16Jesús les dijo: No tienen necesidad de irse; dadles vosotros de comer. 17Y ellos dijeron: No tenemos aquí sino cinco panes y dos peces. 18El les dijo: Traédmelos acá. 19Entonces mandó a la gente recostarse sobre la hierba; y tomando los cinco panes y los dos peces, y levantando los ojos al cielo, bendijo, y partió y dio los panes a los discípulos, y los discípulos a la multitud. 20Y comieron todos, y se saciaron; y recogieron lo que sobró de los pedazos, doce cestas llenas. 21Y los que comieron fueron como cinco mil hombres, sin contar las mujeres y los niños.” (Mateo 14:13-21)
        </div>

        <p>
          Esta narración es conocida como El milagro de la multiplicación de los panes, pero el verdadero milagro no está solo en el pan, sino en el acto de compartir y la transformación del corazón humano.
        </p>

        <p>
          El texto muestra un proceso que nos enseña la solidaridad:
        </p>

        <ul className="list-decimal ml-6 space-y-2">
          <li>
            <strong>Identificar la necesidad:</strong> el hambre de la gente. La solidaridad comienza al reconocer una necesidad y tener la voluntad de dar respuesta.
          </li>
          <li>
            <strong>Alguien se da cuenta del problema:</strong> los discípulos. Permanecer atento a la necesidad es fundamental.
          </li>
          <li>
            <strong>Evadir el problema:</strong> los discípulos intentan lanzarlo a Jesús. Descargar la responsabilidad es cómodo, pero no solidario.
          </li>
          <li>
            <strong>Respuesta de Jesús:</strong> “Dadles vosotros de comer”. Cada necesidad es un reto para quienes la identifican; la solidaridad implica acción personal.
          </li>
          <li>
            <strong>Los cálculos como enemigo:</strong> “solo cinco panes y dos peces”. La lógica humana limita, pero la solidaridad multiplica lo poco.
          </li>
          <li>
            <strong>Confianza y generosidad:</strong> un niño entrega su alimento. El gesto inspira a otros y demuestra que la solidaridad es contagiosa.
          </li>
          <li>
            <strong>El producto de la solidaridad:</strong> doce canastas sobrantes. Simbolizan la nueva comunidad fundada en compartir y solidaridad.
          </li>
        </ul>

        <p>
          La solidaridad rompe los esquemas de dependencia y pasividad. La pedagogía de Dios muestra que podemos actuar: “Hazlo tú mismo, yo estoy contigo”.
        </p>
      </section>

      {/* Conclusión inspiradora */}
      <section className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 border border-white/10 rounded-lg text-gray-900">
        <h2 className="text-2xl font-semibold mb-4">Conclusión Inspiradora</h2>
        <p>
          Jesús toca el corazón del ser humano para que salga de su egoísmo y comparta lo poco que tiene. La solidaridad transforma la comunidad, inspira a otros y crea una red de apoyo que fortalece la sociedad. La verdadera solidaridad comienza con un primer paso, aunque parezca pequeño, y se expande multiplicando los efectos positivos.
        </p>
      </section>

      {/* Bloques temáticos */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold mb-2">Bloques Temáticos</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>La solidaridad nace de la escasez compartida: el milagro depende de compartir lo poco que se tiene.</li>
          <li>Identificar la necesidad: el primer paso para actuar con generosidad.</li>
          <li>El riesgo de evadir responsabilidades: asumir el compromiso es clave.</li>
          <li>El llamado a la acción: &quot;Denles ustedes de comer&quot; muestra la responsabilidad activa.</li>
          <li>El egoísmo y los cálculos: lo poco alcanza cuando se comparte con corazón generoso.</li>
          <li>Confianza y generosidad: el ejemplo del niño inspira a otros a actuar.</li>
          <li>La comunidad que surge de la solidaridad: las doce canastas simbolizan la nueva comunidad solidaria.</li>
        </ul>
      </section>
      </div>
    </article>
  );
};

export default ApendiceSolidaridad;
