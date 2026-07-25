import Link from "next/link";
import { obtenerSello, type ClaveSello } from "@/lib/sellos";
import { cn } from "@/lib/utils";

interface PropsBadgeSello {
  sello: ClaveSello;
  /** Con enlace lleva a la landing del sello. Sin él, es solo etiqueta. */
  conEnlace?: boolean;
  tamano?: "sm" | "md";
  className?: string;
}

export function BadgeSello({
  sello,
  conEnlace = false,
  tamano = "sm",
  className,
}: PropsBadgeSello) {
  const datos = obtenerSello(sello);

  const clases = cn(
    "inline-flex items-center gap-1.5 rounded-full font-semibold uppercase tracking-wider",
    tamano === "sm" ? "px-2.5 py-1 text-[0.6875rem]" : "px-3 py-1.5 text-xs",
    datos.clases.badge,
    conEnlace && "transition-opacity hover:opacity-80",
    className,
  );

  // El punto de color es decorativo: el nombre del sello ya va escrito, así que
  // no añade información para quien usa lector de pantalla.
  const contenido = (
    <>
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", datos.clases.solido)}
      />
      {datos.nombre}
    </>
  );

  if (conEnlace) {
    return (
      <Link href={`/sellos/${datos.slug}`} className={clases}>
        {contenido}
      </Link>
    );
  }

  return <span className={clases}>{contenido}</span>;
}
