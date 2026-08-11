import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type VarianteBoton = "primario" | "secundario" | "fantasma" | "claro";
export type TamanoBoton = "sm" | "md" | "lg";

/**
 * Botón de píldora con microetiqueta en versalitas.
 *
 * El relleno se invierte al pasar por encima —lleno a contorno— en vez de
 * limitarse a oscurecerse. Es el gesto que separa un botón editorial de un botón
 * de aplicación, y no cuesta ni un byte de JavaScript.
 */
const VARIANTES: Record<VarianteBoton, string> = {
  primario:
    "border-marca bg-marca text-marca-contraste hover:bg-transparent hover:text-marca-texto",
  secundario:
    "border-borde-fuerte bg-transparent text-texto hover:border-marca hover:bg-marca hover:text-marca-contraste",
  fantasma: "border-transparent bg-transparent text-marca-texto hover:bg-marca-suave",
  /* Para las secciones oscuras: contorno claro que se rellena de hueso. */
  claro:
    "border-hueso/45 bg-transparent text-hueso hover:border-hueso hover:bg-hueso hover:text-tinta",
};

/**
 * Alturas mínimas de 44 px en `md` y `lg`: es el objetivo táctil recomendado y
 * aquí tres de cada cuatro visitas llegan desde el móvil.
 */
const TAMANOS: Record<TamanoBoton, string> = {
  sm: "h-9 gap-2 px-4 text-[0.625rem]",
  md: "h-11 gap-2.5 px-6 text-[0.6875rem]",
  lg: "h-13 gap-3 px-8 text-[0.75rem]",
};

const BASE =
  "group/boton inline-flex items-center justify-center rounded-full border font-semibold tracking-[0.18em] uppercase leading-none transition-[color,background-color,border-color,transform] duration-300 active:translate-y-px disabled:pointer-events-none disabled:opacity-55";

export function clasesBoton(
  variante: VarianteBoton = "primario",
  tamano: TamanoBoton = "md",
  className?: string,
): string {
  return cn(BASE, VARIANTES[variante], TAMANOS[tamano], className);
}

/** Flecha que avanza al pasar por encima. Decorativa: el texto ya dice la acción. */
function Flecha() {
  return (
    <span
      aria-hidden="true"
      className="transition-transform duration-300 group-hover/boton:translate-x-1"
    >
      →
    </span>
  );
}

interface PropsComunes {
  children: ReactNode;
  variante?: VarianteBoton;
  tamano?: TamanoBoton;
  /** Ocupa todo el ancho disponible. Casi siempre lo que quieres en móvil. */
  completo?: boolean;
  /** Añade la flecha de avance. Para la acción principal de cada bloque. */
  conFlecha?: boolean;
  className?: string;
}

type PropsBoton = PropsComunes & ButtonHTMLAttributes<HTMLButtonElement>;

export function Boton({
  children,
  variante,
  tamano,
  completo,
  conFlecha,
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
      {conFlecha ? <Flecha /> : null}
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
  conFlecha,
  className,
  href,
  externo,
  ...resto
}: PropsEnlace) {
  const clases = clasesBoton(variante, tamano, cn(completo && "w-full", className));
  const contenido = (
    <>
      {children}
      {conFlecha ? <Flecha /> : null}
    </>
  );

  if (externo) {
    return (
      <a href={href} className={clases} target="_blank" rel="noopener noreferrer" {...resto}>
        {contenido}
      </a>
    );
  }

  return (
    <Link href={href} className={clases} {...resto}>
      {contenido}
    </Link>
  );
}
