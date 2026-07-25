import Link from "next/link";
import { PortadaLibro } from "@/components/libros/PortadaLibro";
import { BadgeSello } from "@/components/ui/BadgeSello";
import { etiquetaEstado, type Libro } from "@/lib/contenido/libros";
import { formatearPrecio } from "@/lib/utils";

interface PropsTarjetaLibro {
  libro: Libro;
  /** Solo `true` en la primera tarjeta de una página sin hero. */
  prioridad?: boolean;
  /** Oculta el badge del sello cuando ya estás dentro de ese sello. */
  sinSello?: boolean;
}

/**
 * Tarjeta de libro para catálogo, home, sellos y venta cruzada.
 *
 * Toda la tarjeta es clicable (un `span` absoluto sobre el enlace del título),
 * pero el texto del enlace es el título: es lo que anuncia el lector de pantalla
 * y lo que Google usa como ancla.
 */
export function TarjetaLibro({ libro, prioridad = false, sinSello = false }: PropsTarjetaLibro) {
  const estado = etiquetaEstado(libro);

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
          {sinSello ? null : <BadgeSello sello={libro.sello} />}
          {estado ? (
            <span className="rounded-full border border-borde-fuerte px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wider text-texto-tenue uppercase">
              {estado}
            </span>
          ) : null}
        </div>

        <h3 className="mt-2.5 text-xl leading-snug">
          <Link href={`/libro/${libro.slug}`} className="hover:text-marca-texto">
            <span className="absolute inset-0" aria-hidden="true" />
            {libro.titulo}
          </Link>
        </h3>

        <p className="mt-1.5 text-sm leading-relaxed text-texto-tenue">
          {libro.subtitulo}
        </p>

        <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
          <span className="font-semibold text-texto">
            PDF Premium {formatearPrecio(libro.precios.pdf)}
          </span>
          <span className="text-texto-tenue">
            · Kindle {formatearPrecio(libro.precios.kindle)}
          </span>
        </p>
      </div>
    </article>
  );
}
