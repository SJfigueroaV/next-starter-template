"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function AnimatedBookCover() {
  const containerRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !borderRef.current) return;

    // Crear el elemento de borde animado
    const border = borderRef.current;
    
    // Configurar el borde inicial
    gsap.set(border, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      border: "3px solid #ef4444", // Rojo brillante
      borderRadius: "8px",
      pointerEvents: "none",
      zIndex: 10,
    });

    // Crear la animación del borde que se mueve alrededor
    const tl = gsap.timeline({ repeat: -1, ease: "none" });

    // Animación que simula un borde que se "dibuja" alrededor del rectángulo
    tl.fromTo(border, 
      {
        clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)", // Invisible
      },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", // Lado superior
        duration: 0.5,
      }
    )
    .to(border, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 0%)", // Lado superior + derecho
      duration: 0.5,
    })
    .to(border, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Lado superior + derecho + inferior
      duration: 0.5,
    })
    .to(border, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Completo
      duration: 0.5,
    })
    .to(border, {
      clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)", // Desaparece
      duration: 0.3,
    })
    .to(border, {
      clipPath: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)", // Pausa
      duration: 1,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="relative inline-block">
      {/* Contenedor de la imagen */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden rounded-lg shadow-2xl"
        style={{ width: "200px", height: "280px" }}
      >
        <Image
          src="/PORTADA TODO ES POSIBLE PARA DIOS PRUEBA.jpg"
          alt="Todo es posible para Dios - Portada"
          fill
          className="object-cover"
          priority
        />
        
        {/* Borde animado */}
        <div ref={borderRef} />
        
        {/* Efecto de brillo adicional */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 animate-pulse" />
      </div>
    </div>
  );
}
