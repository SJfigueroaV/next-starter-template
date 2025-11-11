"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import LayoutContent from "./LayoutContent";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLibrosRoute = pathname?.startsWith("/libros");

  // Si estamos en /libros, solo renderizar el contenido
  if (isLibrosRoute) {
    return <>{children}</>;
  }

  // Para otras rutas, renderizar con el layout completo
  return (
    <main className="block md:grid md:grid-cols-[250px_1fr]">
      <LayoutContent>
        {children}
      </LayoutContent>
    </main>
  );
}

