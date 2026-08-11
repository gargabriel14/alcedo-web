"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Hace que el libro siga al cursor.
 *
 * Se usa **solo en la portada destacada y en la ficha**: uno por página. En las
 * tarjetas del catálogo el giro lo hace CSS con `:hover`, porque poner un
 * escuchador por tarjeta significaría veinte suscripciones al puntero en una
 * página de catálogo para un efecto que se ve de una en una.
 *
 * Cómo está hecho, y por qué así:
 *
 * - **No hay estado de React.** El movimiento se escribe directamente en
 *   variables CSS del nodo. Guardarlo en `useState` provocaría un render de React
 *   por cada píxel de movimiento del ratón.
 * - **Interpolación suave con `requestAnimationFrame`.** El libro persigue al
 *   cursor en vez de pegarse a él: es lo que hace que parezca un objeto con peso
 *   y no un adhesivo. El bucle se detiene solo cuando llega a destino.
 * - **No se monta en táctil ni con movimiento reducido.** Sin puntero fino no hay
 *   nada que seguir, así que ni se registra el escuchador.
 */
export function LibroInteractivo({
  children,
  /** Grados máximos de giro lateral. */
  intensidad = 14,
  className,
}: {
  children: ReactNode;
  intensidad?: number;
  className?: string;
}) {
  const escena = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = escena.current;
    if (!nodo) return;

    const punteroFino = window.matchMedia("(pointer: fine)");
    const movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!punteroFino.matches || movimientoReducido.matches) return;

    // Destino (lo que marca el ratón) y posición actual (lo que se pinta).
    let destinoX = 0;
    let destinoY = 0;
    let actualX = 0;
    let actualY = 0;
    let animacion = 0;

    function pintar() {
      actualX += (destinoX - actualX) * 0.08;
      actualY += (destinoY - actualY) * 0.08;

      const elemento = escena.current;
      if (!elemento) return;

      elemento.style.setProperty("--giro-y", `${(actualX * intensidad).toFixed(2)}deg`);
      elemento.style.setProperty(
        "--giro-x",
        `${(-actualY * intensidad * 0.55).toFixed(2)}deg`,
      );
      elemento.style.setProperty("--brillo", actualX.toFixed(3));

      const sigueLejos =
        Math.abs(destinoX - actualX) > 0.001 || Math.abs(destinoY - actualY) > 0.001;

      animacion = sigueLejos ? requestAnimationFrame(pintar) : 0;
    }

    function arrancar() {
      animacion ||= requestAnimationFrame(pintar);
    }

    function alMover(evento: PointerEvent) {
      const caja = nodo!.getBoundingClientRect();
      destinoX = ((evento.clientX - caja.left) / caja.width - 0.5) * 2;
      destinoY = ((evento.clientY - caja.top) / caja.height - 0.5) * 2;
      arrancar();
    }

    function alSalir() {
      destinoX = 0;
      destinoY = 0;
      arrancar();
    }

    nodo.addEventListener("pointermove", alMover);
    nodo.addEventListener("pointerleave", alSalir);

    return () => {
      nodo.removeEventListener("pointermove", alMover);
      nodo.removeEventListener("pointerleave", alSalir);
      if (animacion) cancelAnimationFrame(animacion);
    };
  }, [intensidad]);

  return (
    <div
      ref={escena}
      /* Mientras el cursor está encima, el giro sigue al ratón sin suavizado de
         transición: el suavizado ya lo pone la interpolación del bucle. */
      className={cn("[&_.libro-3d]:hover:[--velocidad-giro:0s]", className)}
    >
      {children}
    </div>
  );
}
