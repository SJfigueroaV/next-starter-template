export default function Acercarse() {
    return (
      <article id="clase" className="block min-h-screen">
        <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
        {/* Título principal */}
          <h1 className="text-4xl font-bold text-yellow-400 mb-8">
            Acercarse
          </h1>
        
  
        {/* Objetivo */}
        <section className="p-6 rounded-lg border border-yellow-400/30 bg-yellow-400/10">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-2">
            🎯 Objetivo
          </h2>
          <p className="text-gray-200 leading-relaxed">
            Reflexionar sobre el significado profundo del <em>acercarse</em>, no
            como un simple gesto de curiosidad, sino como una decisión libre y
            solidaria que transforma tanto al que ayuda como al que recibe.
          </p>
        </section>
  
        {/* Desarrollo */}
        <section className="space-y-6">
          {/* Cita inicial */}
          <blockquote className="italic text-yellow-300 bg-white/5 border border-yellow-400/20 p-4 rounded-lg">
            &quot;Acercándose... No es el acercase del simple espectador o curioso que al
            caminar desprevenido se encuentra con un accidente de tránsito en la
            esquina.&quot;
          </blockquote>
  
          <p className="text-gray-200 leading-relaxed">
            Se trata de un acercamiento como fruto de un proceso: ver y sentir
            compasión. Es un acercarse significativo, al estilo de Jesús, que da
            el corazón sin cálculos ni temor al fracaso.
          </p>
  
          <p className="text-gray-200 leading-relaxed">
            La solidaridad surge como una decisión libre. No basta con ver o
            compadecerse: se requiere actuar. La elección imprime responsabilidad
            y refleja coherencia con los valores fundamentales.
          </p>
  
          <blockquote className="italic text-yellow-300 bg-white/5 border border-yellow-400/20 p-4 rounded-lg">
            &quot;Solidaridad es acercarse. Es decidir. Es cuestión de libertad. Es
            cuestión de responsabilidad personal.&quot;
          </blockquote>
        </section>
  
        {/* Bloques temáticos */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-yellow-300">
            📚 Bloques Temáticos
          </h2>
  
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-yellow-200">
                El acercamiento significativo
              </h3>
              <ul className="list-disc list-inside text-gray-200 space-y-1">
                <li>No es el acercarse de un simple espectador o curioso.</li>
                <li>Es resultado de un proceso: ver y sentir compasión.</li>
                <li>No busca reconocimiento ni beneficios personales.</li>
                <li>
                  Se asemeja al estilo de Jesús: entrega sincera y desinteresada.
                </li>
              </ul>
            </div>
  
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-yellow-200">
                La decisión de ayudar
              </h3>
              <ul className="list-disc list-inside text-gray-200 space-y-1">
                <li>Acercarse implica tomar una decisión consciente y libre.</li>
                <li>
                  No basta con ver el sufrimiento ni sentir compasión; se requiere
                  acción.
                </li>
                <li>
                  La solidaridad se convierte en un acto de voluntad y
                  compromiso.
                </li>
              </ul>
            </div>
  
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-yellow-200">
                Libertad y responsabilidad en la solidaridad
              </h3>
              <ul className="list-disc list-inside text-gray-200 space-y-1">
                <li>
                  La libertad permite elegir ayudar o ignorar la necesidad.
                </li>
                <li>
                  La solidaridad nace cuando la decisión de ayudar se toma con
                  convicción.
                </li>
                <li>
                  No es suficiente hacer el bien por obligación; la clave está en
                  el compromiso genuino.
                </li>
              </ul>
            </div>
  
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-yellow-200">
                El acercamiento como acción transformadora
              </h3>
              <ul className="list-disc list-inside text-gray-200 space-y-1">
                <li>
                  No es un acto casual, sino una respuesta intencional al
                  sufrimiento ajeno.
                </li>
                <li>
                  Acercarse es dignificar, es servir sin esperar nada a cambio.
                </li>
                <li>
                  Es una práctica coherente con los valores fundamentales de la
                  persona.
                </li>
              </ul>
            </div>
  
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold text-yellow-200">
                El llamado a la coherencia y la acción
              </h3>
              <ul className="list-disc list-inside text-gray-200 space-y-1">
                <li>
                  La solidaridad es más que un sentimiento: es una elección
                  activa.
                </li>
                <li>
                  La decisión de acercarse define la autenticidad de la ayuda.
                </li>
                <li>
                  La libertad de elegir el bien refuerza la responsabilidad
                  individual y social.
                </li>
              </ul>
            </div>
          </div>
        </section>
  
        {/* Conclusión */}
        <section className="p-6 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
          <h2 className="text-2xl font-bold mb-2">✨ Conclusión</h2>
          <p className="leading-relaxed font-medium">
            La solidaridad no es un accidente ni un gesto pasajero. Es una
            decisión consciente que transforma vidas, una acción que nace de la
            libertad y florece en la responsabilidad. Acércate: tu decisión puede
            ser la chispa que encienda esperanza en otro.
          </p>
        </section>
        </div>
      </article>
    );
  }
  