import React from "react";

export default function Samaritano() {
  return (
    <article className="max-w-4xl mx-auto p-8 bg-black/40 rounded-xl border border-white/10 text-white space-y-8">
      {/* Título principal */}
      <h1 className="text-4xl font-bold text-center text-yellow-400">
        Un Samaritano
      </h1>

      {/* Objetivo */}
      <section className="p-6 rounded-lg bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-300">🎯 Objetivo</h2>
        <p className="text-gray-200">
          Reflexionar sobre la figura del samaritano como símbolo de solidaridad inesperada, 
          proveniente de los márgenes y la exclusión, mostrando cómo la verdadera fe impulsa 
          a la acción en favor del necesitado.
        </p>
      </section>

      {/* Cita principal */}
      <section>
        <blockquote className="p-4 bg-yellow-500/10 border border-yellow-500/30 italic text-yellow-300 rounded-lg">
          “Pero un samaritano que iba de camino llegó junto a él”
        </blockquote>
      </section>

      {/* Explicación */}
      <section className="space-y-4">
        <p className="text-gray-200">
          Entra en escena un samaritano en el mismo camino, es decir, en la 
          cotidianidad de la existencia, en el cruce de vías donde todos los 
          hombres nos encontramos: el sufrimiento. 
        </p>
        <p className="text-gray-200">
          Un samaritano, un hombre que no pertenece al grupo de los elegidos por Dios. 
          Un anónimo, hereje, así considerado por la oficialidad, puesto que se rehúsa 
          a dar culto a Dios en Jerusalén. Un hombre de la periferia, acusado, mal visto, rechazado. 
        </p>
        <p className="text-gray-200">
          El samaritano es la antítesis de los dos personajes anteriores. 
          Parece que en la lógica de Dios, lo marginado y lo excluido es el lugar privilegiado 
          para manifestar sus procesos de liberación. 
        </p>
        <p className="text-gray-200">
          Los lazos afectivos que se dan entre personas que comparten en medio de la necesidad 
          son más fuertes que los que se pretenden lograr en la mesa de la gente bien.
        </p>
        <p className="text-gray-200">
          Dios es el único capaz de tocar al hombre para que salga de sí mismo y se entregue 
          al servicio de los demás.
        </p>
        <p className="text-gray-200">
          No se necesita tener mucho para ser solidarios, siempre hay algo para dar: 
          una sonrisa, el tiempo para escuchar, un buen consejo, un gesto de amabilidad, 
          o una presencia protectora que brinde seguridad y unidad.
        </p>
      </section>

      {/* Bloques temáticos */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-yellow-400">
          📌 Bloques temáticos del capítulo
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-xl font-medium text-yellow-300">
              1. La figura del samaritano como un personaje inesperado
            </h3>
            <p className="text-gray-200">
              Se introduce al samaritano como un personaje marginado, rechazado 
              y considerado hereje, pero esencial en la historia.
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-xl font-medium text-yellow-300">
              2. La solidaridad desde la periferia y la exclusión
            </h3>
            <p className="text-gray-200">
              La solidaridad surge de quienes no cuentan en la sociedad; Dios actúa 
              a través de los excluidos y marginados.
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-xl font-medium text-yellow-300">
              3. El contraste entre los ricos y los pobres en la práctica de la solidaridad
            </h3>
            <p className="text-gray-200">
              La verdadera solidaridad surge más fácilmente entre los que sufren. 
              Es difícil que quienes tienen mucho den sin esperar algo a cambio.
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-xl font-medium text-yellow-300">
              4. La acción de Dios en la transformación del ser humano
            </h3>
            <p className="text-gray-200">
              Dios toca el corazón de las personas para que se entreguen al servicio 
              de los demás. La fe auténtica lleva a la acción solidaria.
            </p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-xl font-medium text-yellow-300">
              5. La solidaridad más allá de lo material
            </h3>
            <p className="text-gray-200">
              No se trata solo de bienes materiales: también se puede dar tiempo, 
              escucha, amabilidad, protección y compañía.
            </p>
          </div>
        </div>
      </section>

      {/* Conclusión */}
      <section className="p-6 rounded-lg bg-gradient-to-r from-yellow-500/40 to-orange-500/40 border border-yellow-400/30">
        <h2 className="text-2xl font-semibold text-yellow-200 mb-4">✨ Conclusión</h2>
        <p className="text-gray-100">
          El samaritano nos enseña que la verdadera solidaridad nace del corazón 
          dispuesto, no de la abundancia de bienes. Dios se manifiesta en lo sencillo 
          y en lo marginado, recordándonos que siempre hay algo que dar para transformar 
          la vida de otro.
        </p>
      </section>
    </article>
  );
}
