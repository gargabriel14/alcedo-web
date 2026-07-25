import Link from "next/link";
import { CapturaEmail } from "@/components/formularios/CapturaEmail";
import { PortadaLibro } from "@/components/libros/PortadaLibro";
import { BadgeSello } from "@/components/ui/BadgeSello";
import { EnlaceBoton } from "@/components/ui/Boton";
import { Contenedor } from "@/components/ui/Contenedor";
import { LIBRO_DESTACADO } from "@/lib/datos/libros";
import { RECURSO_PORTADA } from "@/lib/datos/recursos";
import { SITIO } from "@/lib/sitio";
import { formatearPrecio } from "@/lib/utils";

/**
 * Sobre el pliegue van tres cosas y solo tres: qué es esto, el libro destacado
 * y la captura de correo con un entregable concreto.
 *
 * Orden en móvil (75 % del tráfico): titular → libro → formulario. Quien llega
 * de un vídeo viene a por el libro; el formulario recoge a quien todavía no
 * compra. En escritorio el libro pasa a la columna derecha y el formulario sube.
 */
export function Hero() {
  const libro = LIBRO_DESTACADO;

  return (
    <section className="border-b border-borde bg-fondo-alterno">
      <Contenedor className="grid gap-10 py-10 sm:py-14 lg:grid-cols-2 lg:items-start lg:gap-14 lg:py-18">
        <div className="lg:col-start-1 lg:row-start-1">
          <p className="ojo-titular">Editorial independiente · No-ficción práctica</p>
          <h1 className="mt-3 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.5rem]">
            {SITIO.claim}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-texto-tenue sm:text-xl">
            {SITIO.propuesta} Cada libro viene con sus plantillas: no te enseñamos
            teoría, te dejamos el trabajo hecho a medias.
          </p>
        </div>

        {/* Libro destacado */}
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="flex gap-5 rounded-lg border border-borde bg-superficie p-4 shadow-tarjeta sm:gap-7 sm:p-6 lg:flex-col lg:items-start lg:gap-6">
            <Link
              href={`/libro/${libro.slug}`}
              className="w-[38%] shrink-0 max-w-44 lg:w-full lg:max-w-72 lg:self-center"
              tabIndex={-1}
              aria-hidden="true"
            >
              <PortadaLibro
                libro={libro}
                decorativa
                prioridad
                sizes="(min-width: 1024px) 18rem, 38vw"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <BadgeSello sello={libro.sello} conEnlace />
                <span className="text-xs font-medium text-texto-tenue">
                  Nuestro libro más vendido
                </span>
              </div>

              <h2 className="mt-2.5 text-2xl leading-tight sm:text-[1.75rem]">
                <Link href={`/libro/${libro.slug}`} className="hover:text-marca-texto">
                  {libro.titulo}
                </Link>
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-texto-tenue sm:text-base">
                {libro.subtitulo}
              </p>

              <p className="mt-3.5 text-sm leading-relaxed text-texto-tenue">
                <span className="font-semibold text-texto">
                  PDF Premium {formatearPrecio(libro.precioPdfEUR)}
                </span>{" "}
                — {libro.promesaPdf}. También en Kindle desde{" "}
                {formatearPrecio(libro.precioKindleEUR)} y en tapa blanda.
              </p>

              <EnlaceBoton
                href={`/libro/${libro.slug}`}
                tamano="md"
                className="mt-4 w-full sm:w-auto"
              >
                Ver el libro
              </EnlaceBoton>
            </div>
          </div>
        </div>

        {/* Captura de correo */}
        <div className="lg:col-start-1 lg:row-start-2">
          <CapturaEmail recurso={RECURSO_PORTADA} />
        </div>
      </Contenedor>
    </section>
  );
}
