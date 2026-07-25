import Link from "next/link";
import { PortadaLibro } from "@/components/libros/PortadaLibro";
import { BadgeSello } from "@/components/ui/BadgeSello";
import type { Libro } from "@/lib/datos/libros";
import { formatearPrecio } from "@/lib/utils";

interface PropsTarjetaLibro {
  libro: Libro;
  /** Solo `true` en la primera tarjeta de una página sin hero. */
  prioridad?: boolean;
}

/**
 * Tarjeta de libro para catálogo, home y venta cruzada.
 *
 * Toda la tarjeta es clicable (el enlace envuelve el bloque), pero el título es
 * el texto del enlace: es lo que anuncia el lector de pantalla y lo que Google
 * usa como ancla.
 */
export function TarjetaLibro({ libro, prioridad = false }: PropsTarjetaLibro) {
  return (
    <article className="group relative flex flex-col">
      <PortadaLibro
        libro={libro}
        decorativa
        prioridad={prioridad}
        sizes="(min-width: 1024px) 20rem, (min-width: 640px) 30vw, 45vw"
        className="transition-transform duration-200 group-hover:-translate-y-1"
      />

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <BadgeSello sello={libro.sello} />
          {libro.estado === "en-preparacion" ? (
            <span className="rounded-full border border-borde-fuerte px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wider text-texto-tenue uppercase">
              En preparación
            </span>
          ) : null}
        </div>

        <h3 className="mt-2.5 text-xl leading-snug">
          <Link href={`/libro/${libro.slug}`} className="hover:text-marca-texto">
            {/* Área clicable de toda la tarjeta. */}
            <span className="absolute inset-0" aria-hidden="true" />
            {libro.titulo}
          </Link>
        </h3>

        <p className="mt-1.5 text-sm leading-relaxed text-texto-tenue">
          {libro.subtitulo}
        </p>

        <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
          <span className="font-semibold text-texto">
            PDF Premium {formatearPrecio(libro.precioPdfEUR)}
          </span>
          <span className="text-texto-tenue">
            · Kindle {formatearPrecio(libro.precioKindleEUR)}
          </span>
        </p>
      </div>
    </article>
  );
}
