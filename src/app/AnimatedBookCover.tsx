"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function AnimatedBookCover() {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !line1Ref.current || !line2Ref.current) return;

    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const container = containerRef.current;
    
    // Configurar las líneas iniciales
    gsap.set([line1, line2], {
      position: "absolute",
      background: "linear-gradient(90deg, #ff6b35, #ff8c42, #ff6b35)",
      borderRadius: "2px",
      pointerEvents: "none",
      zIndex: 10,
      boxShadow: "0 0 10px #ff6b35, 0 0 20px #ff6b35, 0 0 30px #ff6b35",
    });

    // Línea 1: esquina superior izquierda
    gsap.set(line1, {
      width: "60px",
      height: "3px",
      top: "-1.5px",
      left: "-1.5px",
      transformOrigin: "left center",
    });

    // Línea 2: esquina inferior derecha
    gsap.set(line2, {
      width: "60px", 
      height: "3px",
      bottom: "-1.5px",
      right: "-1.5px",
      transformOrigin: "right center",
    });

    // Crear la animación de movimiento continuo
    const tl = gsap.timeline({ repeat: -1, ease: "none" });

    // Animación de la línea 1 (esquina superior izquierda)
    tl.to(line1, {
      x: "calc(100% + 60px)", // Se mueve hacia la derecha
      duration: 2.5,
      ease: "power2.inOut",
    })
    .to(line1, {
      rotation: 90, // Rota para seguir el lado derecho
      duration: 0.3,
      ease: "power2.inOut",
    })
    .to(line1, {
      y: "calc(100% + 60px)", // Se mueve hacia abajo
      duration: 2.5,
      ease: "power2.inOut",
    })
    .to(line1, {
      rotation: 180, // Rota para seguir el lado inferior
      duration: 0.3,
      ease: "power2.inOut",
    })
    .to(line1, {
      x: "-60px", // Se mueve hacia la izquierda
      duration: 2.5,
      ease: "power2.inOut",
    })
    .to(line1, {
      rotation: 270, // Rota para seguir el lado izquierdo
      duration: 0.3,
      ease: "power2.inOut",
    })
    .to(line1, {
      y: "-60px", // Se mueve hacia arriba
      duration: 2.5,
      ease: "power2.inOut",
    })
    .to(line1, {
      rotation: 0, // Vuelve a la posición inicial
      duration: 0.3,
      ease: "power2.inOut",
    });

    // Animación de la línea 2 (esquina inferior derecha) - con delay para crear el efecto de seguimiento
    const tl2 = gsap.timeline({ repeat: -1, ease: "none" });
    
    tl2.to(line2, {
      x: "-60px", // Se mueve hacia la izquierda
      duration: 2.5,
      ease: "power2.inOut",
      delay: 1.25, // Delay para crear el efecto de seguimiento
    })
    .to(line2, {
      rotation: -90, // Rota para seguir el lado izquierdo
      duration: 0.3,
      ease: "power2.inOut",
    })
    .to(line2, {
      y: "-60px", // Se mueve hacia arriba
      duration: 2.5,
      ease: "power2.inOut",
    })
    .to(line2, {
      rotation: -180, // Rota para seguir el lado superior
      duration: 0.3,
      ease: "power2.inOut",
    })
    .to(line2, {
      x: "calc(100% + 60px)", // Se mueve hacia la derecha
      duration: 2.5,
      ease: "power2.inOut",
    })
    .to(line2, {
      rotation: -270, // Rota para seguir el lado derecho
      duration: 0.3,
      ease: "power2.inOut",
    })
    .to(line2, {
      y: "calc(100% + 60px)", // Se mueve hacia abajo
      duration: 2.5,
      ease: "power2.inOut",
    })
    .to(line2, {
      rotation: 0, // Vuelve a la posición inicial
      duration: 0.3,
      ease: "power2.inOut",
    });

    return () => {
      tl.kill();
      tl2.kill();
    };
  }, []);

  return (
    <div className="relative inline-block">
      {/* Contenedor de la imagen */}
      <div 
        ref={containerRef}
        className="relative overflow-visible rounded-lg shadow-2xl"
        style={{ width: "200px", height: "280px" }}
      >
        <Image
          src="/PORTADA TODO ES POSIBLE PARA DIOS PRUEBA.jpg"
          alt="Todo es posible para Dios - Portada"
          fill
          className="object-cover rounded-lg"
          priority
        />
        
        {/* Líneas animadas */}
        <div ref={line1Ref} />
        <div ref={line2Ref} />
        
        {/* Efecto de brillo adicional */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 animate-pulse rounded-lg" />
      </div>
    </div>
  );
}
