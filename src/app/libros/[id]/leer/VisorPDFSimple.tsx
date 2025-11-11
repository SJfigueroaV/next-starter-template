"use client";

import { useState } from "react";
import Link from "next/link";

type Libro = {
  id: number;
  titulo: string;
  archivo_pdf_url: string;
};

type VisorPDFSimpleProps = {
  libro: Libro;
};

export default function VisorPDFSimple({ libro }: VisorPDFSimpleProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        </div>
      </div>

      {/* Contenedor del PDF */}
      <div className="w-full h-[calc(100vh-64px)]">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <Link
                href={`/libros/${libro.id}`}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Volver al detalle del libro
              </Link>
            </div>
          </div>
        ) : (
          <iframe
            src={libro.archivo_pdf_url}
            className="w-full h-full border-0"
            title={libro.titulo}
            onLoad={() => setLoading(false)}
            onError={() => {
              setError("Error al cargar el PDF");
              setLoading(false);
            }}
          />
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white">Cargando PDF...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

