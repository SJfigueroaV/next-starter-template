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
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) {
        setScale(1.2); // Móvil: 120% para mejor legibilidad
      } else if (window.innerWidth < 1024) {
        setScale(1.1); // Tablet: un poco más grande para mejor legibilidad
      } else {
        setScale(1.45); // Desktop: 145% como predeterminado
      }
    }
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
        const devicePixelRatio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
        
        // Crear viewport con el scale original
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

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(numPages || 1, prev + 1));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(3.0, prev + 0.25));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.25));
  };

  const resetZoom = () => {
    let defaultScale = 1.0;
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) {
        defaultScale = 1.2; // Móvil: 120% para mejor legibilidad
      } else if (window.innerWidth < 1024) {
        defaultScale = 1.1; // Tablet
      } else {
        defaultScale = 1.45; // Desktop: 145% como predeterminado
      }
    }
    setScale(defaultScale);
    if (showZoomMenu) {
      setShowZoomMenu(false);
    }
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Barra de navegación superior */}
      <div className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 px-2 sm:px-4 py-2 sm:py-3">
        <div className="max-w-7xl mx-auto">
          {/* Primera fila: Título y botón volver (móvil) o todo junto (desktop) */}
          <div className="flex items-center justify-between mb-2 md:mb-0">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <Link
                href={`/libros/${libro.id}`}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 sm:gap-2 flex-shrink-0"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Volver</span>
              </Link>
              <h1 className="text-sm sm:text-lg font-semibold truncate max-w-xs sm:max-w-md">{libro.titulo}</h1>
            </div>

            {/* Controles de zoom en móvil (menú desplegable) */}
            <div className="md:hidden relative zoom-menu-container">
              <button
                onClick={() => setShowZoomMenu(!showZoomMenu)}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
                title="Controles de zoom"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </button>
              {showZoomMenu && (
                <div className="absolute right-0 top-full mt-2 bg-gray-700 rounded-lg shadow-lg p-2 min-w-[180px] z-50 zoom-menu-container">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={zoomOut}
                      className="p-2 bg-gray-600 hover:bg-gray-500 rounded"
                      title="Alejar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                      </svg>
                    </button>
                    <span className="text-xs px-2 min-w-[50px] text-center">{Math.round(scale * 100)}%</span>
                    <button
                      onClick={zoomIn}
                      className="p-2 bg-gray-600 hover:bg-gray-500 rounded"
                      title="Acercar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      resetZoom();
                      setShowZoomMenu(false);
                    }}
                    className="w-full px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded text-xs"
                    title="Restablecer zoom"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Segunda fila: Controles de navegación y zoom (solo desktop) */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Página anterior"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm px-3">
                  {pageNumber} / {numPages || "..."}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={pageNumber >= (numPages || 1)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Página siguiente"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Controles de zoom */}
              <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
                <button
                  onClick={zoomOut}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
                  title="Alejar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                  </svg>
                </button>
                <span className="text-sm px-2 min-w-[60px] text-center">{Math.round(scale * 100)}%</span>
                <button
                  onClick={zoomIn}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded"
                  title="Acercar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </button>
                <button
                  onClick={resetZoom}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  title="Restablecer zoom"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor del PDF */}
      <div className="flex justify-center items-start p-2 sm:p-4 md:p-8 overflow-auto pb-20 md:pb-4 min-h-[calc(100vh-120px)] bg-gray-900">
        {error ? (
          <div className="text-center py-12 px-4">
            <p className="text-red-400 mb-4 text-sm sm:text-base">{error}</p>
            <Link
              href={`/libros/${libro.id}`}
              className="text-blue-400 hover:text-blue-300 underline text-sm sm:text-base"
            >
              Volver al detalle del libro
            </Link>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center w-full h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400 text-sm sm:text-base">Cargando PDF...</p>
            </div>
          </div>
        ) : (
          <div 
            className="bg-white shadow-2xl"
            style={{
              maxWidth: '900px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              margin: '0',
              padding: '0',
              lineHeight: '0',
            }}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
          >
            <canvas
              ref={canvasRef}
              className="block"
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                margin: '0',
                padding: '0',
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                imageRendering: 'auto',
              }}
            />
          </div>
        )}
      </div>

      {/* Barra de navegación inferior (móvil) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-3 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-2.5 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-500"
            title="Página anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium px-4">
            {pageNumber} / {numPages || "..."}
          </span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1)}
            className="p-2.5 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed active:bg-gray-500"
            title="Página siguiente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

