import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Ancho = "lectura" | "normal" | "ancho";

const ANCHOS: Record<Ancho, string> = {
  /** Artículos y textos largos: mantiene la medida de línea de 65–75 caracteres. */
  lectura: "max-w-lectura",
  normal: "max-w-6xl",
  ancho: "max-w-7xl",
};

interface PropsContenedor {
  children: ReactNode;
  /** Etiqueta semántica. Por defecto `div`. */
  como?: ElementType;
  ancho?: Ancho;
  className?: string;
}

export function Contenedor({
  children,
  como: Como = "div",
  ancho = "normal",
  className,
}: PropsContenedor) {
  return (
    <Como className={cn("mx-auto w-full px-5 sm:px-8", ANCHOS[ancho], className)}>
      {children}
    </Como>
  );
}
