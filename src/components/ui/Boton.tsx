import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type VarianteBoton = "primario" | "secundario" | "fantasma";
export type TamanoBoton = "sm" | "md" | "lg";

const VARIANTES: Record<VarianteBoton, string> = {
  primario:
    "bg-marca text-marca-contraste hover:bg-marca-hover shadow-sm hover:shadow-md active:translate-y-px",
  secundario:
    "border border-borde-fuerte bg-superficie text-texto hover:border-marca hover:text-marca-texto",
  fantasma: "text-marca-texto hover:bg-marca-suave",
};

/**
 * Alturas mínimas de 44 px en `md` y `lg`: es el objetivo táctil recomendado y
 * aquí tres de cada cuatro visitas llegan desde el móvil.
 */
const TAMANOS: Record<TamanoBoton, string> = {
  sm: "h-9 gap-1.5 px-3 text-sm",
  md: "h-11 gap-2 px-5 text-[0.9375rem]",
  lg: "h-13 gap-2.5 px-7 text-base sm:text-lg",
};

const BASE =
  "inline-flex items-center justify-center rounded-md font-medium leading-none transition-[color,background-color,border-color,box-shadow,translate] duration-150 disabled:pointer-events-none disabled:opacity-55";

export function clasesBoton(
  variante: VarianteBoton = "primario",
  tamano: TamanoBoton = "md",
  className?: string,
): string {
  return cn(BASE, VARIANTES[variante], TAMANOS[tamano], className);
}

interface PropsComunes {
  children: ReactNode;
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
  /** Ocupa todo el ancho disponible. Casi siempre lo que quieres en móvil. */
  completo?: boolean;
  className?: string;
}

type PropsBoton = PropsComunes & ButtonHTMLAttributes<HTMLButtonElement>;

export function Boton({
  children,
  variante,
  tamano,
  completo,
  className,
  type = "button",
  ...resto
}: PropsBoton) {
  return (
    <button
      type={type}
      className={clasesBoton(variante, tamano, cn(completo && "w-full", className))}
      {...resto}
    >
      {children}
    </button>
  );
}

type PropsEnlace = PropsComunes &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    /** Enlace externo: abre en pestaña nueva con `rel` seguro. */
    externo?: boolean;
  };

export function EnlaceBoton({
  children,
  variante,
  tamano,
  completo,
  className,
  href,
  externo,
  ...resto
}: PropsEnlace) {
  const clases = clasesBoton(variante, tamano, cn(completo && "w-full", className));

  if (externo) {
    return (
      <a
        href={href}
        className={clases}
        target="_blank"
        rel="noopener noreferrer"
        {...resto}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={clases} {...resto}>
      {children}
    </Link>
  );
}
