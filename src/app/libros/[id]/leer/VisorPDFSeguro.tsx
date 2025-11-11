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
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const pdfjsLibRef = useRef<any>(null);

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
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
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
    setScale(1.5);
  };

  // Prevenir clic derecho y descarga
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Barra de navegación superior */}
      <div className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/libros/${libro.id}`}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </Link>
            <h1 className="text-lg font-semibold truncate max-w-md">{libro.titulo}</h1>
          </div>

          {/* Controles de navegación */}
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

      {/* Contenedor del PDF */}
      <div className="flex justify-center p-4 overflow-auto">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <Link
              href={`/libros/${libro.id}`}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Volver al detalle del libro
            </Link>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center w-full h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando PDF...</p>
            </div>
          </div>
        ) : (
          <div 
            className="bg-white rounded-lg shadow-2xl p-4"
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
          >
            <canvas
              ref={canvasRef}
              className="shadow-lg"
              style={{
                maxWidth: "100%",
                height: "auto",
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
              }}
            />
          </div>
        )}
      </div>

      {/* Barra de navegación inferior (móvil) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm">
            {pageNumber} / {numPages || "..."}
          </span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50"
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

