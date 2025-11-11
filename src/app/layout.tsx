import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./ConditionalLayout";
const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Pedagogia del cultivo",
  description: "Institucion ecopedagogica"

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/planta.ico" />

      </head>
      <body className={inter.className}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
    </body>
    </html>
  );
}
