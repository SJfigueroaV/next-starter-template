import React from 'react';

const LaPromesa: React.FC = () => {
    return (
        <article id="clase" className="block min-h-screen">
            <div className="min-h-screen max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-yellow-400 mb-8">
                    La promesa
                </h1>
                {/* Objetivo */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-4">Objetivo</h2>
                    <div className="bg-black/30 backdrop-blur-lg p-6 rounded-lg border border-white/10">
                        <p className="text-lg text-gray-200 leading-relaxed">
                            Analizar la propuesta bíblica de transformación del ser humano desde su condición caída hasta su restauración en la luz de Dios, mediante el estudio de la purificación de la inmundicia e idolatría, el nuevo nacimiento espiritual y la acción del Espíritu de Dios, resaltando la importancia de la Palabra como dinamizadora del proceso de cambio y garantizando una vida conforme al propósito divino.
                        </p>
                    </div>
                </section>
                {/* Bloques temáticos */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-4">Bloques Temáticos</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-lg">
                            <h3 className="text-yellow-400 font-semibold mb-2">La condición del hombre caído y su alejamiento de Dios</h3>
                            <ul className="list-disc list-inside text-gray-200 ml-4">
                                <li>Dominio de las tinieblas sobre la humanidad.</li>
                                <li>Consecuencias de una mente reprobada.</li>
                                <li>Manifestaciones de la corrupción humana según Romanos 1:28-31.</li>
                            </ul>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg">
                            <h3 className="text-yellow-400 font-semibold mb-2">La promesa de transformación de Dios</h3>
                            <ul className="list-disc list-inside text-gray-200 ml-4">
                                <li>Restauración del hombre de la oscuridad a la luz.</li>
                                <li>Paso de la esclavitud a la libertad y de la muerte a la vida.</li>
                                <li>El propósito ontológico de Dios para el ser humano (espíritu, alma y cuerpo).</li>
                            </ul>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg">
                            <h3 className="text-yellow-400 font-semibold mb-2">La distorsión religiosa de la propuesta divina</h3>
                            <ul className="list-disc list-inside text-gray-200 ml-4">
                                <li>Construcción de religiones, tiempos, lugares y objetos sagrados.</li>
                                <li>Tradiciones humanas vs. el diseño original de Dios.</li>
                            </ul>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg">
                            <h3 className="text-yellow-400 font-semibold mb-2">El proceso de retorno a Dios</h3>
                            <ul className="list-disc list-inside text-gray-200 ml-4">
                                <li>Dios reúne a los dispersos y los lleva a su luz.</li>
                                <li>La nacionalidad celestial y la vida en el ámbito de Dios.</li>
                            </ul>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg">
                            <h3 className="text-yellow-400 font-semibold mb-2">La limpieza de la inmundicia e idolatría</h3>
                            <ul className="list-disc list-inside text-gray-200 ml-4">
                                <li>La sangre de Cristo como reconciliación con Dios.</li>
                                <li>La Palabra como medio de purificación.</li>
                                <li>El bautismo como expresión de una conciencia renovada.</li>
                                <li>El corazón humano como el centro de transformación.</li>
                            </ul>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg">
                            <h3 className="text-yellow-400 font-semibold mb-2">El nuevo nacimiento espiritual</h3>
                            <ul className="list-disc list-inside text-gray-200 ml-4">
                                <li>Corazón nuevo y espíritu nuevo como restauración interior.</li>
                                <li>Nacimiento divino frente a la muerte espiritual.</li>
                                <li>La transformación en imagen de Cristo.</li>
                            </ul>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg">
                            <h3 className="text-yellow-400 font-semibold mb-2">La acción de Dios en la transformación humana</h3>
                            <ul className="list-disc list-inside text-gray-200 ml-4">
                                <li>Cambio del corazón de piedra por un corazón de carne.</li>
                                <li>El Espíritu de Dios como autoridad en la vida del creyente.</li>
                                <li>La clave de la transformación: creer, entender, obedecer y actuar.</li>
                            </ul>
                        </div>
                        <div className="bg-black/20 p-4 rounded-lg md:col-span-2">
                            <h3 className="text-yellow-400 font-semibold mb-2">La permanencia en la Palabra como garantía de transformación</h3>
                            <ul className="list-disc list-inside text-gray-200 ml-4">
                                <li>Jesús como fuente de limpieza y renovación.</li>
                                <li>La necesidad de sensibilidad espiritual para recibir sanidad y restauración.</li>
                            </ul>
                        </div>
                    </div>
                </section>
                {/* Desarrollo temático */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-8">Desarrollo Temático</h2>
                    <div className="space-y-8">
                        <p className="text-lg text-gray-200 leading-relaxed">
                            Hay una promesa frente a la situación del hombre caído, alejado de Dios y bajo el dominio de los gobernadores de las tinieblas, quienes después de hacer que la mente del hombre fuese reprobada por Dios, los inducen a cometer actos que &quot;no convienen&quot;, como lo dice el apóstol Pablo: atestados de toda injusticia, fornicación, perversidad, avaricia, maldad; llenos de envidia, homicidios, contiendas, engaños y malignidades; murmuradores, detractores, aborrecedores de Dios, injuriosos, soberbios, altivos, inventores de males, desobedientes a los padres, necios, desleales, sin afecto natural, implacables, sin misericordia (Romanos 1:28-31).
                        </p>
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                            <p className="text-lg text-yellow-200 italic">
                                &quot;La promesa de Dios es que el ser humano sea transformado al pasar de la oscuridad a la luz, de la esclavitud a la libertad, de la muerte a la vida.&quot;
                            </p>
                        </div>
                        <p className="text-lg text-gray-200 leading-relaxed">
                            Este es el auténtico propósito de Dios diseñado en la Biblia. La propuesta bíblica no es un asunto religioso. Se trata de una transformación ontológica, es decir, del SER: espíritu, alma y cuerpo, como unidad indisoluble.
                        </p>
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                            <p className="text-lg text-yellow-200 italic">
                                &quot;En el libro del profeta Ezequiel se lee: &apos;Y yo os tomaré de las naciones, y os recogeré de todas las tierras, y os traeré a vuestro país...&apos; (Ezequiel 36:24-28).&quot;
                            </p>
                        </div>
                        <p className="text-lg text-gray-200 leading-relaxed">
                            Dios mismo dirige la operación de retorno a Él. Si caminar en las tinieblas equivale a no tener la nacionalidad celestial, entonces volver a Él es moverse en el ámbito celestial donde el ser humano pertenece.
                        </p>
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                            <p className="text-lg text-yellow-200 italic">
                                &quot;Promete limpiar de toda inmundicia e idolatría. Después de ser reconciliados con Dios por medio de la sangre de Cristo (Romanos 5:10)... Dios promete limpiar al ser humano de toda inmundicia e idolatría.&quot;
                            </p>
                        </div>
                        <p className="text-lg text-gray-200 leading-relaxed">
                            La Palabra de Dios es la que limpia de toda inmundicia e idolatría; esa Palabra que es espíritu y vida. El bautismo es el signo por medio del cual se expresa esta disposición y voluntad del ser humano a ser limpiados y vivir una conciencia recta delante de Dios (1Pedro 3:21).
                        </p>
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                            <p className="text-lg text-yellow-200 italic">
                                &quot;Jesús afirma que lo que sale del corazón del ser humano es lo que lo contamina, porque de ahí salen los malos pensamientos, los homicidios, los adulterios, las fornicaciones, los hurtos, los falsos testimonios, las blasfemias (Mateo 5:19-20).&quot;
                            </p>
                        </div>
                        <p className="text-lg text-gray-200 leading-relaxed">
                            Es una agua limpia que hace referencia a la Palabra o Espíritu que viene de Jesús; pero que al creer en Él, se convierte en una fuente en el interior del ser humano (Juan 7:37-39).
                        </p>
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                            <p className="text-lg text-yellow-200 italic">
                                &quot;La limpieza de toda inmundicia e idolatría del corazón del ser humano se realiza por la presencia de Cristo dentro de él (Gálatas 4:6).&quot;
                            </p>
                        </div>
                        <p className="text-lg text-gray-200 leading-relaxed">
                            Solo la Palabra de Dios tiene la capacidad de limpiar el interior del ser humano, solo su Espíritu puede transformar al hombre llevándolo al propósito de Dios: &quot;ser hechos conforme la imagen de su hijo&quot; (Romanos 8:29).
                        </p>
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                            <p className="text-lg text-yellow-200 italic">
                                &quot;Os daré corazón nuevo y pondré espíritu nuevo dentro de vosotros...&quot;
                            </p>
                        </div>
                        <p className="text-lg text-gray-200 leading-relaxed">
                            Recibir un corazón nuevo es garantía de nuevos pensamientos, así como una nueva vida llena de luz al tener un espíritu nuevo. Todo esto forma parte del plan de Transformación diseñado por Dios para restaurar la vida del hombre caído en la oscuridad.
                        </p>
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                            <p className="text-lg text-yellow-200 italic">
                                &quot;Ese corazón solo es posible cuando Dios quite de nosotros el corazón de piedra (incredulidad) y lo cambie por un corazón de carne (Jesús), la Palabra de Dios hecha carne.&quot;
                            </p>
                        </div>
                        <p className="text-lg text-gray-200 leading-relaxed">
                            El espíritu nuevo es el mismo Espíritu de Dios que tomará autoridad como Vida en nosotros (Ezequiel 36:27). Solo así el ser humano podrá andar en los estatutos de Dios, guardarlos y ponerlos por obra. Aquí está la llave secreta de la Transformación.
                        </p>
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                            <p className="text-lg text-yellow-200 italic">
                                &quot;La propuesta bíblica de transformación del hombre no recae sobre su voluntad porque ella se encuentra cautiva por la tiniebla. Nunca el ser humano podrá ser mejor desde su protagonismo o por sus propios medios. Es necesaria la acción de Dios que transforma radicalmente la vida de las personas.&quot;
                            </p>
                        </div>
                        <p className="text-lg text-gray-200 leading-relaxed">
                            La Palabra de Dios o su Espíritu, que es lo mismo, es quien dinamiza el proceso de Transformación. Por ello es necesario frente a la Palabra asumir actitudes de: creer, entender, obedecer y poner por obra.
                        </p>
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                            <p className="text-lg text-yellow-200 italic">
                                &quot;Jesús dice: &apos;Permaneced en mí y yo en vosotros&apos; (Juan 15:4). Es garantía de dar fruto.&quot;
                            </p>
                        </div>
                        <p className="text-lg text-gray-200 leading-relaxed">
                            &quot;Porque el corazón de este pueblo se ha vuelto insensible; se les han embotado los oídos, y se les han cerrado los ojos. De lo contario, verían con los ojos, oirían con los oídos, entenderían con el corazón y se convertirían, y yo los sanaría.&quot;
                        </p>
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                            <p className="text-lg text-yellow-200 italic">
                                &quot;La declaración de Jesús en Juan 15:3 es fundamental para entender este proceso de transformación: &apos;Ya ustedes están limpios por la palabra que les he hablado&apos;&quot;
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </article>
    );
};

export default LaPromesa;