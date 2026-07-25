import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PropsTituloSeccion {
  /** Antetítulo en versalitas. Orienta sin robar peso al titular. */
  ojo?: string;
  titulo: ReactNode;
  /** Párrafo de entrada, una o dos frases. */
  entrada?: ReactNode;
  /** Enlace a la derecha en escritorio, debajo en móvil. */
  enlace?: { texto: string; ruta: string };
  id?: string;
  className?: string;
}

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
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {ojo ? <p className="ojo-titular mb-2.5">{ojo}</p> : null}
        <h2 id={id} className="text-3xl sm:text-4xl">
          {titulo}
        </h2>
        {entrada ? (
          <p className="mt-3 text-base text-texto-tenue sm:text-lg">{entrada}</p>
        ) : null}
      </div>

      {enlace ? (
        <Link
          href={enlace.ruta}
          className="group inline-flex shrink-0 items-center gap-1.5 text-[0.9375rem] font-medium text-marca-texto hover:underline"
        >
          {enlace.texto}
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      ) : null}
    </div>
  );
}
