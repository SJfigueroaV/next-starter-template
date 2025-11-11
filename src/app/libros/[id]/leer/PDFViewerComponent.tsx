"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useState, useEffect } from "react";

// Configurar el worker para react-pdf v6
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

type PDFViewerComponentProps = {
  pdfUrl: string;
  pageNumber: number;
  scale: number;
  onLoadSuccess: (data: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  onPageChange: (page: number) => void;
  onScaleChange: (scale: number) => void;
};

export default function PDFViewerComponent({
  pdfUrl,
  pageNumber,
  scale,
  onLoadSuccess,
  onLoadError,
  onPageChange,
  onScaleChange,
}: PDFViewerComponentProps) {
  const [numPages, setNumPages] = useState<number | null>(null);

  function handleLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    onLoadSuccess({ numPages });
  }

  return (
    <Document
      file={pdfUrl}
      onLoadSuccess={handleLoadSuccess}
      onLoadError={onLoadError}
      loading={
        <div className="flex items-center justify-center w-full h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando PDF...</p>
          </div>
        </div>
      }
      className="flex justify-center"
    >
      <Page
        pageNumber={pageNumber}
        scale={scale}
        renderTextLayer={true}
        renderAnnotationLayer={true}
        className="shadow-lg"
      />
    </Document>
  );
}

