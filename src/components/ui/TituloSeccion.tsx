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
  /** Sobre fondo oscuro. */
  oscuro?: boolean;
  className?: string;
}

export function TituloSeccion({
  ojo,
  titulo,
  entrada,
  enlace,
  id,
  oscuro = false,
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
        {ojo ? (
          <p className={cn("ojo-titular mb-4", oscuro && "text-hueso/55")}>{ojo}</p>
        ) : null}

        <h2
          id={id}
          className={cn(
            "text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.12] [&_em]:text-marca-texto [&_em]:italic",
            oscuro && "text-hueso [&_em]:text-marca",
          )}
        >
          {titulo}
        </h2>

        {entrada ? (
          <p
            className={cn(
              "mt-4 max-w-[56ch] text-base leading-relaxed text-texto-tenue sm:text-lg",
              oscuro && "text-hueso/60",
            )}
          >
            {entrada}
          </p>
        ) : null}
      </Revelar>

      {enlace ? (
        <Link
          href={enlace.ruta}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 pb-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase",
            oscuro ? "text-hueso hover:text-marca" : "text-marca-texto",
          )}
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
