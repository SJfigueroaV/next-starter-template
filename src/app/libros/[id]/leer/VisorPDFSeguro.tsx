"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Libro = {
  id: number;
  titulo: string;
  archivo_pdf_url: string;
};

type VisorPDFSeguroProps = {
  libro: Libro;
};

export default function VisorPDFSeguro({ libro }: VisorPDFSeguroProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const pdfjsLibRef = useRef<any>(null);
  const [showZoomMenu, setShowZoomMenu] = useState(false);

  // Ajustar scale inicial según el tamaño de pantalla
  useEffect(() => {
    // El ajuste inicial se hará después de cargar la página y obtener sus dimensiones
  }, []);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar PDF.js desde CDN para evitar problemas con webpack
        if (typeof window === "undefined") return;

        if (!pdfjsLibRef.current) {
          // Cargar PDF.js desde CDN usando script tag
          await new Promise<void>((resolve, reject) => {
            // Verificar si ya está cargado
            const win = window as any;
            if (win.pdfjsLib || win.pdfjs) {
              pdfjsLibRef.current = win.pdfjsLib || win.pdfjs;
              if (pdfjsLibRef.current && pdfjsLibRef.current.GlobalWorkerOptions) {
                pdfjsLibRef.current.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
              }
              resolve();
              return;
            }

            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
            script.onload = () => {
              // PDF.js se expone como pdfjsLib o pdfjs dependiendo de la versión
              pdfjsLibRef.current = win.pdfjsLib || win.pdfjs;
              if (pdfjsLibRef.current && pdfjsLibRef.current.GlobalWorkerOptions) {
                pdfjsLibRef.current.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
              }
              resolve();
            };
            script.onerror = () => reject(new Error("Error al cargar PDF.js desde CDN"));
            document.head.appendChild(script);
          });
        }

        if (!pdfjsLibRef.current) {
          throw new Error("No se pudo cargar PDF.js");
        }

        // Cargar el PDF usando PDF.js
        const loadingTask = pdfjsLibRef.current.getDocument({
          url: libro.archivo_pdf_url,
          // Deshabilitar algunas funciones para mayor seguridad
          disableAutoFetch: true,
          disableStream: true,
          // Mejorar calidad de renderizado
          verbosity: 0, // 0 = errores, 1 = warnings, 5 = infos
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/cmaps/',
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setPageNumber(1);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar el PDF:", err);
        setError("Error al cargar el PDF. Por favor, intenta de nuevo.");
        setLoading(false);
      }
    };

    loadPDF();
  }, [libro.archivo_pdf_url]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current || pageNumber < 1) return;

      try {
        const page = await pdfDoc.getPage(pageNumber);

        // Obtener devicePixelRatio para pantallas de alta densidad (mejor calidad)
        // Eliminamos el límite de 2 para permitir máxima resolución en pantallas retina/4k
        const devicePixelRatio = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;

        // Si es la primera carga (scale es 1.0 por defecto), calcular scale óptimo
        // Solo hacerlo una vez al inicio o cuando cambia el libro
        if (scale === 1.0 && pageNumber === 1) {
          const viewportOriginal = page.getViewport({ scale: 1.0 });
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;

          // Calcular scale para ajustar al ancho (con margen)
          // Restamos 40px para márgenes laterales
          const fitWidthScale = (windowWidth - 20) / viewportOriginal.width;

          // Calcular scale para ajustar al alto (con margen)
          // Restamos 120px para header y márgenes
          const fitHeightScale = (windowHeight - 100) / viewportOriginal.height;

          // Usar fitWidthScale como preferido para mayor resolución (aunque requiera scroll vertical)
          let optimalScale = fitWidthScale;

          // Si el scale calculado es muy pequeño (ej. móvil), asegurar un mínimo legible
          // Pero respetando los bordes
          if (optimalScale < 0.5) optimalScale = 0.5;

          setScale(optimalScale);

          // Intentar rotar si es necesario (solo en dispositivos móviles/tablets que soporten la API)
          if (viewportOriginal.width > viewportOriginal.height) {
            // Es horizontal
            try {
              if (screen.orientation && (screen.orientation as any).lock) {
                (screen.orientation as any).lock('landscape').catch(() => {
                  // Ignorar error si no se puede bloquear (ej. desktop)
                });
              }
            } catch (e) {
              // Ignorar errores de API no soportada
            }
          }
        }

        // Crear viewport con el scale actual
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d", {
          alpha: false,
          desynchronized: false,
          willReadFrequently: false,
        });

        if (!context) {
          console.error("No se pudo obtener el contexto del canvas");
          return;
        }

        // Ajustar tamaño del canvas multiplicando por devicePixelRatio para mejor calidad
        const outputScale = devicePixelRatio;
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.width = Math.floor(viewport.width * outputScale);

        // Establecer el tamaño CSS del canvas (tamaño visual)
        canvas.style.height = `${viewport.height}px`;
        canvas.style.width = `${viewport.width}px`;

        // Limpiar el canvas antes de renderizar
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Configurar el contexto para mejor calidad de renderizado
        context.save();
        context.scale(outputScale, outputScale);

        // Configurar calidad de renderizado
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          // Mejorar calidad de renderizado
          enableWebGL: false,
          renderInteractiveForms: false,
        };

        await page.render(renderContext).promise;
        context.restore();
      } catch (err) {
        console.error("Error al renderizar la página:", err);
      }
    };

    renderPage();
  }, [pdfDoc, pageNumber, scale]);

  // Recalcular zoom al cambiar tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      if (pdfDoc && pageNumber > 0) {
        // Debounce simple
        const timeoutId = setTimeout(async () => {
          try {
            const page = await pdfDoc.getPage(pageNumber);
            const viewportOriginal = page.getViewport({ scale: 1.0 });
            const windowWidth = window.innerWidth;

            // Solo calculamos fitWidthScale
            const fitWidthScale = (windowWidth - 40) / viewportOriginal.width;

            let optimalScale = fitWidthScale;
            if (optimalScale < 0.5) optimalScale = 0.5;

            // Solo actualizar si la diferencia es significativa para evitar loops
            if (Math.abs(scale - optimalScale) > 0.1) {
              setScale(optimalScale);
            }
          } catch (e) {
            console.error("Error al recalcular zoom:", e);
          }
        }, 200);
        return () => clearTimeout(timeoutId);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pdfDoc, pageNumber, scale]);

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(numPages || 1, prev + 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(5.0, prev + 0.10));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(0.1, prev - 0.10));
  };

  const resetZoom = async () => {
    // Recalcular el zoom óptimo
    if (!pdfDoc) {
      setScale(1.0);
      return;
    }

    try {
      const page = await pdfDoc.getPage(pageNumber);
      const viewportOriginal = page.getViewport({ scale: 1.0 });
      const windowWidth = window.innerWidth;

      // Usar fitWidthScale
      const fitWidthScale = (windowWidth - 20) / viewportOriginal.width;

      let optimalScale = fitWidthScale;
      if (optimalScale < 0.5) optimalScale = 0.5;

      setScale(optimalScale);
    } catch (e) {
      setScale(1.0);
    }

    if (showZoomMenu) {
      setShowZoomMenu(false);
    }
  };

  const toggleOrientation = () => {
    try {
      if (screen.orientation && (screen.orientation as any).lock) {
        const currentType = screen.orientation.type;
        const newType = currentType.includes('portrait') ? 'landscape' : 'portrait';
        (screen.orientation as any).lock(newType).catch((e: any) => {
          console.warn("No se pudo rotar:", e);
        });
      }
    } catch (e) {
      console.error("API de orientación no soportada");
    }
    if (showZoomMenu) setShowZoomMenu(false);
  };

  // Prevenir clic derecho y descarga
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Cerrar menú de zoom al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showZoomMenu && !target.closest('.zoom-menu-container')) {
        setShowZoomMenu(false);
      }
    };

    if (showZoomMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showZoomMenu]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Barra de navegación superior - Rediseñada */}
      <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between relative">

            {/* Izquierda: Botón Volver */}
            <div className="flex-shrink-0 w-20">
              <Link
                href={`/libros/${libro.id}`}
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
              >
                <div className="p-1.5 rounded-full group-hover:bg-gray-800 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </div>
                <span className="hidden sm:inline text-sm font-medium">Salir</span>
              </Link>
            </div>

            {/* Centro: Título y Controles Principales */}
            <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-4">
              <h1 className="text-sm sm:text-base font-medium text-gray-200 truncate max-w-[200px] sm:max-w-md mb-1 sm:mb-2">
                {libro.titulo}
              </h1>

              {/* Controles Desktop Centrados */}
              <div className="hidden md:flex items-center gap-6 bg-gray-800/50 rounded-full px-6 py-1.5 border border-gray-700/50">
                {/* Paginación */}
                <div className="flex items-center gap-3 border-r border-gray-700 pr-6">
                  <button
                    onClick={goToPrevPage}
                    disabled={pageNumber <= 1}
                    className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                    title="Anterior"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-sm font-mono text-gray-300 min-w-[60px] text-center">
                    {pageNumber} / {numPages || "-"}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={pageNumber >= (numPages || 1)}
                    className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                    title="Siguiente"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Zoom */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={zoomOut}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                    title="Alejar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-sm font-mono text-gray-300 min-w-[45px] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={zoomIn}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors"
                    title="Acercar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button
                    onClick={resetZoom}
                    className="ml-2 text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded hover:bg-blue-400/10 transition-colors"
                    title="Ajustar a pantalla"
                  >
                    Ajustar
                  </button>
                </div>
              </div>
            </div>

            {/* Derecha: Menú Móvil / Espacio vacío Desktop */}
            <div className="flex-shrink-0 w-20 flex justify-end">
              <div className="md:hidden relative zoom-menu-container">
                <button
                  onClick={() => setShowZoomMenu(!showZoomMenu)}
                  className="p-2 text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </button>

                {showZoomMenu && (
                  <div className="absolute right-0 top-full mt-3 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-4 min-w-[220px] z-50 backdrop-blur-xl">
                    <div className="space-y-4">
                      {/* Zoom Controls Mobile */}
                      <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-2">
                        <button onClick={zoomOut} className="p-2 text-gray-400 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-sm font-mono font-medium">{Math.round(scale * 100)}%</span>
                        <button onClick={zoomIn} className="p-2 text-gray-400 hover:text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => { resetZoom(); setShowZoomMenu(false); }}
                          className="flex flex-col items-center justify-center gap-1 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          Ajustar
                        </button>
                        <button
                          onClick={toggleOrientation}
                          className="flex flex-col items-center justify-center gap-1 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Rotar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor del PDF */}
      <div className="flex-1 flex justify-center items-start overflow-auto bg-gray-950 relative">
        {error ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="bg-red-500/10 p-4 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-400 mb-6">{error}</p>
            <Link
              href={`/libros/${libro.id}`}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
            >
              Volver al detalle
            </Link>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400 animate-pulse">Cargando tu lectura...</p>
          </div>
        ) : (
          <div
            className="my-4 sm:my-8 shadow-2xl transition-transform duration-200 ease-out origin-top"
            style={{
              maxWidth: 'none', // Permitir que crezca según el zoom
              margin: '20px auto', // Centrado horizontal
            }}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
          >
            <canvas
              ref={canvasRef}
              className="block bg-white"
              style={{
                display: 'block',
                userSelect: "none",
                WebkitUserSelect: "none",
                boxShadow: '0 0 50px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        )}
      </div>

      {/* Barra de navegación inferior (móvil) */}
      <div className="md:hidden sticky bottom-0 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 p-4 z-40">
        <div className="flex items-center justify-between max-w-sm mx-auto bg-gray-800/50 rounded-full p-1.5 border border-gray-700/50">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full disabled:opacity-30 disabled:bg-transparent transition-all active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-mono font-medium text-gray-200">
            {pageNumber} <span className="text-gray-500">/</span> {numPages || "-"}
          </span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1)}
            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full disabled:opacity-30 disabled:bg-transparent transition-all active:scale-95 shadow-lg shadow-blue-900/20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
