import React from "react";

export default function SolidaridadSeContagia() {
  return (
    <article id="clase" className="block min-h-screen">
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      {/* Título principal */}
      <h1 className="text-4xl font-bold text-yellow-400 mb-8">
        La Solidaridad se Contagia
      </h1>

      {/* Sección de Objetivo */}
      <section className="bg-gray-800/70 border border-white/10 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Objetivo</h2>
        <p className="text-gray-200 leading-relaxed">
          Reflexionar sobre cómo la solidaridad auténtica se manifiesta en actos
          de entrega total, generosidad y contagio a otros, transformando a
          quienes participan en ella.
        </p>
      </section>

      {/* Contenido principal */}
      <section className="space-y-6">
        <p className="text-gray-200 leading-relaxed">
          Al día siguiente, sacando dos denarios se los dio al posadero y dijo:{" "}
          <span className="bg-yellow-400/10 border border-white/10 italic text-yellow-300 p-2 rounded-lg">
            &quot;Cuida de él, y si gastas algo más, te lo pagaré cuando vuelva&quot;
          </span>
        </p>

        <p className="text-gray-200 leading-relaxed">
          Esta es la evidencia de que El Samaritano pasó toda la noche cuidando
          al hombre caído. Entregó todo de sí: su ciencia y su tiempo. También
          parte de su dinero, destinado para sus compras en Jerusalén. Dos
          denarios representaban dos días de trabajo. Un regalo es bueno, pero
          dos significa generosidad.
        </p>

        <p className="text-gray-200 leading-relaxed">
          Solidaridad es darlo todo sin recibir nada a cambio. La respuesta
          final se encuentra en boca de Jesús: la vida eterna.
        </p>

        <p className="text-gray-200 leading-relaxed">
          Con su generosidad, el Samaritano involucra al posadero en la
          solidaridad. La recomendación &quot;si gastas algo más, te lo pagaré cuando
          vuelva&quot; impacta al posadero y lo mueve a la acción. La solidaridad se
          contagia: un acto sincero inspira a otros a actuar generosamente.
        </p>

        <p className="text-gray-200 leading-relaxed">
          La fuerza de un gesto solidario puede transformar tanto al que recibe
          como al que da, generando un efecto multiplicador que impacta a la
          comunidad.
        </p>
      </section>

      {/* Bloques temáticos */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Bloques Temáticos</h2>

        <div className="bg-gray-800/70 border border-white/10 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-yellow-300">La entrega total del Samaritano</h3>
          <p className="text-gray-200">
            El Samaritano no solo brinda ayuda inmediata, sino que pasa toda la
            noche cuidando al hombre caído. Su solidaridad va más allá del
            momento, involucrando su tiempo, conocimiento y recursos económicos.
          </p>
          <p className="text-gray-200">
            La generosidad se evidencia en la entrega de dos denarios, equivalente
            a dos días de trabajo.
          </p>
        </div>

        <div className="bg-gray-800/70 border border-white/10 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-yellow-300">Solidaridad sin esperar recompensa</h3>
          <p className="text-gray-200">
            El Samaritano no recibe nada material a cambio de su acto de bondad.
            La verdadera recompensa es trascendental: la vida eterna, según Jesús.
          </p>
          <p className="text-gray-200">
            La solidaridad auténtica no busca reconocimiento ni gratificación personal.
          </p>
        </div>

        <div className="bg-gray-800/70 border border-white/10 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-yellow-300">Involucrar a otros en la solidaridad</h3>
          <p className="text-gray-200">
            El Samaritano no solo ayuda directamente, sino que también involucra
            al posadero en el acto solidario. Esto genera un compromiso y un
            proceso en cadena de solidaridad.
          </p>
        </div>

        <div className="bg-gray-800/70 border border-white/10 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-yellow-300">El efecto multiplicador de la solidaridad</h3>
          <p className="text-gray-200">
            Un solo acto solidario inspira a muchas personas, motivando a otros a
            comprometerse. Ejemplos reales muestran cómo pequeñas contribuciones
            pueden generar grandes cambios.
          </p>
        </div>

        <div className="bg-gray-800/70 border border-white/10 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-yellow-300">El poder del testimonio y la transformación personal</h3>
          <p className="text-gray-200">
            La fuerza de un gesto solidario cambia el corazón de las personas.
            La solidaridad no es puntual, sino un proceso que transforma tanto al
            que recibe como al que da.
          </p>
        </div>
      </section>

      {/* Conclusión inspiradora */}
      <section className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 text-gray-900">
        <h2 className="text-2xl font-bold mb-2">Conclusión</h2>
        <p className="leading-relaxed">
          La solidaridad auténtica se contagia y multiplica. Cada acto de generosidad
          transforma vidas y fortalece la comunidad, demostrando que dar con el
          corazón abierto es el camino para construir un mundo más justo y humano.
        </p>
      </section>
      </div>
    </article>
  );
}