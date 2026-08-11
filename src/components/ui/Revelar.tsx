"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Aparición al entrar en pantalla.
 *
 * Un solo `IntersectionObserver` compartido por todos los elementos, que además
 * deja de observar cada uno en cuanto aparece: no queda nada escuchando scroll.
 * El estado inicial lo pone CSS solo si el documento tiene la clase `js`, así que
 * sin JavaScript el contenido se ve desde el principio en vez de quedarse en
 * blanco. Con `prefers-reduced-motion` la animación no existe.
 */
let observador: IntersectionObserver | null = null;

function obtenerObservador(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;

  observador ??= new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        entrada.target.setAttribute("data-visible", "true");
        observador?.unobserve(entrada.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  return observador;
}

interface PropsRevelar {
  children: ReactNode;
  /** Etiqueta a renderizar. Por defecto `div`. */
  como?: ElementType;
  /** Retraso en milisegundos, para escalonar elementos de una misma fila. */
  retraso?: number;
  className?: string;
}

export function Revelar({
  children,
  como: Como = "div",
  retraso = 0,
  className,
}: PropsRevelar) {
  const referencia = useRef<HTMLElement>(null);

  useEffect(() => {
    const elemento = referencia.current;
    if (!elemento) return;

    const observadorActual = obtenerObservador();

    if (!observadorActual) {
      elemento.setAttribute("data-visible", "true");
      return;
    }

    observadorActual.observe(elemento);
    return () => observadorActual.unobserve(elemento);
  }, []);

  return (
    <Como
      ref={referencia}
      className={cn("revelar", className)}
      style={retraso ? { transitionDelay: `${retraso}ms` } : undefined}
    >
      {children}
    </Como>
  );
}
