import Link from "next/link";
import { PortadaLibro } from "@/components/libros/PortadaLibro";
import { BadgeSello } from "@/components/ui/BadgeSello";
import { etiquetaEstado, type LibroTarjeta } from "@/lib/contenido/tarjeta";
import { formatearPrecio } from "@/lib/utils";

interface PropsTarjetaLibro {
  libro: LibroTarjeta;
  /** Solo `true` en la primera tarjeta de una página sin hero. */
  prioridad?: boolean;
  /** Oculta el badge del sello cuando ya estás dentro de ese sello. */
  sinSello?: boolean;
}

/**
 * Tarjeta de libro para catálogo, home, sellos y venta cruzada.
 *
 * El libro gira al pasar el cursor y la sombra se estira con él: el objeto se
 * despega del papel. Es la única animación de la tarjeta y va en `transform`, así
 * que la compone la GPU y no provoca ni un reflujo.
 *
 * Toda la tarjeta es clicable (un `span` absoluto sobre el enlace del título),
 * pero el texto del enlace es el título: es lo que anuncia el lector de pantalla
 * y lo que Google usa como ancla.
 */
export function TarjetaLibro({
  libro,
  prioridad = false,
  sinSello = false,
}: PropsTarjetaLibro) {
  const estado = etiquetaEstado(libro);

  return (
    <article className="group relative flex flex-col">
      <div className="relative">
        <PortadaLibro
          libro={libro}
          decorativa
          prioridad={prioridad}
          sizes="(min-width: 1024px) 20rem, (min-width: 640px) 30vw, 45vw"
          claseLibro="group-hover:[--giro-y:24deg] group-hover:[--elevacion:-10px]"
        />

        {estado ? (
          <span className="absolute top-3 left-3 z-10 rounded-full border border-borde bg-fondo px-3 py-1.5 text-[0.625rem] font-semibold tracking-[0.18em] text-texto-tenue uppercase">
            {estado}
          </span>
        ) : null}
      </div>

      <div className="mt-8 flex flex-1 flex-col">
        {sinSello ? null : (
          <div className="mb-3">
            <BadgeSello sello={libro.sello} />
          </div>
        )}

        <h3 className="text-xl leading-snug sm:text-[1.4rem]">
          <Link href={`/libro/${libro.slug}`} className="hover:text-marca-texto">
            <span className="absolute inset-0" aria-hidden="true" />
            {libro.titulo}
          </Link>
        </h3>

        <p className="mt-1.5 font-titulares text-[0.95rem] text-marca-texto italic">
          {libro.autorNombre}
        </p>

        <p className="mt-3 max-w-[34ch] flex-1 text-sm leading-relaxed text-texto-tenue">
          {libro.subtitulo}
        </p>

        <p className="mt-5 flex items-center justify-between border-t border-borde pt-4">
          <span className="text-[0.95rem] font-semibold text-texto">
            {formatearPrecio(libro.precioPdf)}
          </span>
          <span className="text-[0.65rem] font-semibold tracking-[0.18em] text-texto-tenue uppercase transition-colors group-hover:text-marca-texto">
            Ver ficha{" "}
            <span
              aria-hidden="true"
              className="inline-block transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </p>
      </div>
    </article>
  );
}
