import Link from "next/link";
import type { ReactNode } from "react";
import { Revelar } from "@/components/ui/Revelar";
import { cn } from "@/lib/utils";

interface PropsTituloSeccion {
  /** Antetítulo en versalitas con filete. Orienta sin robar peso al titular. */
  ojo?: string;
  /**
   * Titular. Admite `<em>` para la palabra de acento, que va en cursiva y en el
   * color de marca: es el gesto que da carácter editorial a la jerarquía.
   */
  titulo: ReactNode;
  /** Párrafo de entrada, una o dos frases. */
  entrada?: ReactNode;
  /** Enlace a la derecha en escritorio, debajo en móvil. */
  enlace?: { texto: string; ruta: string };
  id?: string;
  className?: string;
}

/**
 * Cabecera de sección.
 *
 * **No tiene variante para fondo oscuro, y es a propósito.** La tenía, y pintaba
 * los colores a mano (`text-hueso/60`, `text-marca`), lo que dejaba el verde de
 * marca en 2,3:1 sobre tinta —por debajo del 4,5:1 que exige WCAG— y el anillo de
 * foco invisible. Ahora es la banda la que declara `sobre-oscuro` y redefine sus
 * tokens; este componente usa los de siempre y sale correcto en los dos fondos.
 *
 * La regla general: el color lo decide el contenedor, no cada componente.
 */
export function TituloSeccion({
  ojo,
  titulo,
  entrada,
  enlace,
  id,
  className,
}: PropsTituloSeccion) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10",
        className,
      )}
    >
      <Revelar className="max-w-2xl">
        {ojo ? <p className="ojo-titular mb-4">{ojo}</p> : null}

        <h2
          id={id}
          className="text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.12] [&_em]:text-marca-texto [&_em]:italic"
        >
          {titulo}
        </h2>

        {entrada ? (
          <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-texto-tenue sm:text-lg">
            {entrada}
          </p>
        ) : null}
      </Revelar>

      {enlace ? (
        <Link
          href={enlace.ruta}
          className="group inline-flex shrink-0 items-center gap-2 pb-1 text-[0.65rem] font-semibold tracking-[0.18em] text-marca-texto uppercase"
        >
          {enlace.texto}
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      ) : null}
    </div>
  );
}
