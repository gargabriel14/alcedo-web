"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PropsLibro3D {
  titulo: string;
  autor: string;
  colorPortada?: string;
  className?: string;
  interactivo?: boolean;
}

/**
 * Libro 3D renderizado con CSS transforms.
 * 
 * Crea un efecto tridimensional elegante mostrando:
 * - Portada frontal
 * - Lomo con grosor
 * - Sombra proyectada
 * - Perspectiva que responde al cursor (opcional)
 * 
 * NO usa WebGL/Three.js para mantener el rendimiento.
 * CSS 3D transforms es suficiente para este nivel de sofisticación.
 */
export function Libro3D({
  titulo,
  autor,
  colorPortada = "#1a1a1a",
  className,
  interactivo = true,
}: PropsLibro3D) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [rotacion, setRotacion] = useState({ x: 0, y: 0 });
  const [elevacion, setElevacion] = useState(0);

  useEffect(() => {
    if (!interactivo || !contenedorRef.current) return;

    const elemento = contenedorRef.current;

    const manejarMovimiento = (e: MouseEvent) => {
      const rect = elemento.getBoundingClientRect();
      const centroX = rect.left + rect.width / 2;
      const centroY = rect.top + rect.height / 2;

      // Calcular offset desde el centro (-1 a 1)
      const offsetX = (e.clientX - centroX) / (rect.width / 2);
      const offsetY = (e.clientY - centroY) / (rect.height / 2);

      // Rotación sutil basada en posición del cursor
      // Máximo ±8 grados para elegancia
      const rotacionY = offsetX * 8;
      const rotacionX = -offsetY * 8;

      setRotacion({ x: rotacionX, y: rotacionY });
      setElevacion(Math.abs(offsetX) * 4 + Math.abs(offsetY) * 4);
    };

    const manejarSalida = () => {
      setRotacion({ x: 0, y: 0 });
      setElevacion(0);
    };

    elemento.addEventListener("mousemove", manejarMovimiento);
    elemento.addEventListener("mouseleave", manejarSalida);

    return () => {
      elemento.removeEventListener("mousemove", manejarMovimiento);
      elemento.removeEventListener("mouseleave", manejarSalida);
    };
  }, [interactivo]);

  const estiloTransform = interactivo
    ? {
        transform: `perspective(1000px) rotateX(${rotacion.x}deg) rotateY(${rotacion.y}deg) translateZ(${elevacion}px)`,
      }
    : {
        transform: "perspective(1000px) rotateX(0deg) rotateY(-15deg)",
      };

  return (
    <div
      ref={contenedorRef}
      className={cn("relative w-48 sm:w-56 md:w-64 lg:w-72", className)}
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative transition-transform duration-300 ease-out"
        style={estiloTransform}
        aria-label={`Libro: ${titulo}, de ${autor}`}
        role="img"
      >
        {/* Sombra proyectada */}
        <div
          className="absolute inset-0 rounded-r-md bg-black/20 blur-xl"
          style={{
            transform: "translateZ(-20px) translateY(24px) scale(0.9)",
            filter: "blur(24px)",
          }}
          aria-hidden="true"
        />

        {/* Contenedor principal del libro */}
        <div
          className="relative aspect-[2/3] rounded-sm rounded-r-md shadow-2xl"
          style={{
            backgroundColor: colorPortada,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Portada frontal */}
          <div
            className="absolute inset-0 flex flex-col justify-between rounded-sm rounded-r-md p-5 sm:p-6"
            style={{
              backfaceVisibility: "visible",
              transform: "translateZ(12px)",
            }}
          >
            {/* Banda superior del sello */}
            <div
              className="h-[6%] w-full"
              style={{ backgroundColor: "#0e7c9b" }}
              aria-hidden="true"
            />

            {/* Contenido de portada */}
            <div className="mt-4 flex flex-1 flex-col">
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase text-white/70"
                aria-hidden="true"
              >
                Editorial Alcedo
              </span>

              <h3 className="mt-3 font-titulares text-2xl sm:text-3xl font-semibold leading-tight text-white">
                {titulo}
              </h3>

              <p className="mt-2 text-sm text-white/60">{autor}</p>
            </div>

            {/* Decoración inferior */}
            <div>
              <div
                className="mb-3 h-px w-1/4 bg-white/30"
                aria-hidden="true"
              />
              <span
                className="text-xs font-semibold tracking-[0.15em] uppercase text-white/80"
                aria-hidden="true"
              >
                Premium
              </span>
            </div>
          </div>

          {/* Lomo del libro (grosor) */}
          <div
            className="absolute left-0 top-0 h-full w-3 origin-left"
            style={{
              backgroundColor: shadeColor(colorPortada, -20),
              transform: "rotateY(-90deg) translateZ(0px)",
              transformStyle: "preserve-3d",
            }}
            aria-hidden="true"
          >
            {/* Texto en el lomo */}
            <div
              className="flex h-full items-center justify-center"
              style={{
                transform: "rotateY(90deg)",
                writingMode: "vertical-rl",
                textOrientation: "mixed",
              }}
            >
              <span className="truncate text-xs font-semibold tracking-wider text-white/80">
                {titulo.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Página lateral (efecto de grosor) */}
          <div
            className="absolute right-0 top-0 h-full w-2 origin-right"
            style={{
              backgroundColor: "#f5f1e8",
              transform: "rotateY(90deg) translateZ(12px)",
            }}
            aria-hidden="true"
          >
            {/* Líneas sutiles simulando páginas */}
            <div
              className="h-full w-full opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 1px,
                  rgba(0,0,0,0.08) 1px,
                  rgba(0,0,0,0.08) 2px
                )`,
              }}
            />
          </div>

          {/* Brillo superficial */}
          <div
            className="pointer-events-none absolute inset-0 rounded-sm rounded-r-md opacity-0 transition-opacity duration-500"
            style={{
              background: `linear-gradient(
                135deg,
                rgba(255,255,255,0.15) 0%,
                transparent 40%,
                transparent 60%,
                rgba(255,255,255,0.08) 100%
              )`,
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Utilidad para oscurecer/aclarar color hexadecimal.
 * factor: -100 (negro) a +100 (blanco)
 */
function shadeColor(hex: string, factor: number): string {
  // Eliminar # si existe
  const limpio = hex.replace(/^#/, "");

  // Convertir a RGB
  const r = parseInt(limpio.substring(0, 2), 16);
  const g = parseInt(limpio.substring(2, 4), 16);
  const b = parseInt(limpio.substring(4, 6), 16);

  // Aplicar factor
  const ajustar = (valor: number) => {
    const nuevo = valor + (factor * 2.55);
    return Math.max(0, Math.min(255, Math.round(nuevo)));
  };

  const nr = ajustar(r);
  const ng = ajustar(g);
  const nb = ajustar(b);

  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}
