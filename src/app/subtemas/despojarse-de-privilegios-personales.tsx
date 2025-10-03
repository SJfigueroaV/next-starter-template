import React from "react";

export default function DespojarseDePrivilegios() {
  return (
    <article id="clase" className="block min-h-screen" >
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
      {/* Título principal */}
      <h1 className="text-4xl font-bold text-yellow-400 mb-8">
        Despojarse de privilegios personales
      </h1>

      {/* Sección de Objetivo */}
      <section className="p-4 bg-white/10 rounded-lg border border-white/20">
        <h2 className="text-2xl font-semibold text-white mb-2">Objetivo</h2>
        <p className="text-gray-200 leading-relaxed">
          Reflexionar sobre la importancia de renunciar a privilegios personales y
          comodidades para ejercer la solidaridad auténtica y comprometida con los demás.
        </p>
      </section>

      {/* Contenido principal */}
      <section className="space-y-6">
        <p className="text-gray-200 leading-relaxed">
          Y montándole sobre su propia cabalgadura, le llevó a una posada y cuidó de él. 
          La solidaridad mueve a despojarse de la propia cabalgadura para ofrecerla al hombre caído. 
          Despojarse de comodidades, de beneficios personales, de los propios derechos. 
          Solidaridad es incomodarse para beneficiar a otros.
        </p>

        <p className="text-gray-200 leading-relaxed">
          No es fácil ser solidario. 
          ¿Cómo renunciar a privilegios? 
          ¿La sociedad donde vivimos nos enseña a renunciar a derechos adquiridos para cederlos a los demás? 
          Solidaridad es compartir. Para ser solidarios debemos incomodarnos cediendo nuestras comodidades.
        </p>

        <div className="p-4 bg-yellow-600/20 border border-white/10 rounded-lg italic text-yellow-400">
          ¡Qué difícil es ser realmente solidario!
        </div>

        <p className="text-gray-200 leading-relaxed">
          El samaritano se bajó de su cabalgadura. Esto quiero decir que la solidaridad exige el proceso de bajarnos de nuestras comodidades para servir. 
          Las cabalgaduras representan estatus, nivel social, posición económica, conocimientos, modos de pensar, estilos de vida…
        </p>

        <p className="text-gray-200 leading-relaxed">
          El samaritano llevó al hombre caído a una posada y cuidó de él. No se preocupa sólo de conducirlo a un lugar donde puedan darle mejor atención y luego descarga su responsabilidad en otro. 
          Él se compromete personalmente a cuidarlo. Muchas veces nuestra solidaridad termina en el hospital. Descargamos la responsabilidad en los demás y nos desembarcamos del problema.
        </p>

        <p className="text-gray-200 leading-relaxed">
          La solidaridad conduce a las últimas consecuencias: dedicar todo el tiempo al hombre caído. Eso es solidaridad.
        </p>
      </section>

      {/* Bloques temáticos */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Bloques temáticos</h2>

        <div className="p-4 bg-white/10 border border-white/10 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-400">1. La solidaridad como renuncia a privilegios</h3>
          <p className="text-gray-200 leading-relaxed">
            La verdadera solidaridad implica despojarse de comodidades, beneficios personales y hasta derechos.
            No se trata solo de compartir bienes ajenos, sino de ceder lo propio.
            La sociedad actual no incentiva la renuncia a privilegios, lo que hace más difícil la solidaridad genuina.
          </p>
        </div>

        <div className="p-4 bg-white/10 border border-white/10 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-400">2. El desafío de bajarse de la cabalgadura</h3>
          <p className="text-gray-200 leading-relaxed">
            La cabalgadura representa estatus, nivel social, posición económica, conocimientos, modos de pensar, estilos de vida.
            La solidaridad requiere bajarse de estas posiciones para servir de manera auténtica.
            Muchas personas evitan ayudar porque no quieren incomodarse ni perder sus ventajas.
          </p>
        </div>

        <div className="p-4 bg-white/10 border border-white/10 rounded-lg">
          <h3 className="text-xl font-semibold text-yellow-400">3. La solidaridad como compromiso personal</h3>
          <p className="text-gray-200 leading-relaxed">
            No basta con trasladar al necesitado a un lugar donde puedan ayudarlo; se debe asumir una responsabilidad directa.
            La solidaridad no es delegar la ayuda en otros y desentenderse del problema.
            Implica dedicar tiempo y esfuerzo hasta las últimas consecuencias.
          </p>
        </div>
      </section>

      {/* Conclusión */}
      <section className="p-6 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold text-lg text-center">
        La auténtica solidaridad requiere despojarse de privilegios, comprometerse con los demás y dedicar tiempo y corazón hasta las últimas consecuencias.
      </section>
      </div>
    </article>
  );
}
