import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PropsRevelar {
  children: ReactNode;
  /** Etiqueta a renderizar. Por defecto `div`. */
  como?: ElementType;
  /** Retraso en milisegundos, para escalonar elementos de una misma fila. */
  retraso?: number;
  className?: string;
}

/**
 * Marca un bloque para que aparezca al entrar en pantalla.
 *
 * **Es un componente de servidor y no lleva ni una línea de JavaScript.** Solo
 * pone una clase; de observarla se encarga `<ObservadorRevelar />`, que se monta
 * una sola vez en el layout.
 *
 * Antes esto era un componente de cliente con su `useEffect` y su `ref`. Solo en
 * la portada había once, es decir, once fronteras de hidratación y once trozos
 * más en la carga que React manda al navegador, para una animación decorativa.
 * Medido en producción, la hidratación de la portada costaba 330 ms de bloqueo
 * del hilo principal. Un adorno no puede pagarse con el tiempo de respuesta.
 */
export function Revelar({
  children,
  como: Como = "div",
  retraso = 0,
  className,
}: PropsRevelar) {
  return (
    <Como
      className={cn("revelar", className)}
      style={retraso ? { transitionDelay: `${retraso}ms` } : undefined}
    >
      {children}
    </Como>
  );
}
