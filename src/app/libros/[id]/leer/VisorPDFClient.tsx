"use client";

import VisorPDFSeguro from "./VisorPDFSeguro";

type Libro = {
  id: number;
  titulo: string;
  archivo_pdf_url: string;
};

type VisorPDFClientProps = {
  libro: Libro;
};

export default function VisorPDFClient({ libro }: VisorPDFClientProps) {
  return <VisorPDFSeguro libro={libro} />;
}
