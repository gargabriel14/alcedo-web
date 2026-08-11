import Link from "next/link";
import { CapturaEmail } from "@/components/formularios/CapturaEmail";
import { PortadaLibro } from "@/components/libros/PortadaLibro";
import { BadgeSello } from "@/components/ui/BadgeSello";
import { EnlaceBoton } from "@/components/ui/Boton";
import { Contenedor } from "@/components/ui/Contenedor";
import { Revelar } from "@/components/ui/Revelar";
import { libroDestacado } from "@/lib/contenido/libros";
import { aTarjeta } from "@/lib/contenido/tarjeta";
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
 *
 * La «A» gigante del fondo va en contorno y muy tenue: da profundidad de portada
 * de revista sin competir con el titular ni con el libro.
 */
export function Hero() {
  const libro = libroDestacado();

  return (
    <section className="relative overflow-hidden border-b border-borde bg-fondo-alterno">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -right-[6%] -translate-y-1/2 font-titulares text-[min(58vw,760px)] leading-none font-semibold text-transparent select-none"
        style={{ WebkitTextStroke: "1.5px color-mix(in srgb, var(--texto) 8%, transparent)" }}
      >
        A
      </span>

      <Contenedor className="relative grid gap-12 py-12 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
        <div className="lg:col-start-1 lg:row-start-1">
          <Revelar>
            <p className="ojo-titular">Editorial independiente · No-ficción práctica</p>
          </Revelar>

          <Revelar retraso={80}>
            <h1 className="mt-6 text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.04]">
              Conocimiento con <em className="text-marca-texto italic">puntería</em>.
            </h1>
          </Revelar>

          <Revelar retraso={140}>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-texto-tenue">
              {SITIO.propuesta} Cada libro viene con sus plantillas: no te enseñamos
              teoría, te dejamos el trabajo hecho a medias.
            </p>
          </Revelar>

          <Revelar retraso={200}>
            <div className="mt-9 flex flex-wrap gap-4">
              <EnlaceBoton href="/catalogo" tamano="lg" conFlecha>
                Ver el catálogo
              </EnlaceBoton>
              <EnlaceBoton href="/sobre-alcedo" variante="secundario" tamano="lg">
                Conocer la editorial
              </EnlaceBoton>
            </div>
          </Revelar>

          <Revelar retraso={260}>
            <p className="mt-8 text-[0.65rem] font-semibold tracking-[0.22em] text-texto-tenue uppercase">
              Tres sellos <span className="text-marca">·</span> Plantillas incluidas{" "}
              <span className="text-marca">·</span> Garantía de 14 días
            </p>
          </Revelar>
        </div>

        {/* Libro destacado */}
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <Revelar retraso={120} className="flex flex-col items-center gap-8">
            <div className="relative w-full max-w-[15rem] sm:max-w-[17rem] lg:max-w-[20rem]">
              <p
                aria-hidden="true"
                className="absolute -top-2 -right-8 z-10 hidden items-center gap-3 text-[0.6rem] font-semibold tracking-[0.34em] text-marca-texto uppercase after:block after:h-11 after:w-px after:bg-marca sm:flex sm:[writing-mode:vertical-rl]"
              >
                Libro destacado
              </p>

              <Link href={`/libro/${libro.slug}`} tabIndex={-1} aria-hidden="true">
                <PortadaLibro
                  libro={aTarjeta(libro)}
                  decorativa
                  prioridad
                  grosor={40}
                  giro={16}
                  sizes="(min-width: 1024px) 20rem, (min-width: 640px) 17rem, 15rem"
                  claseLibro="motion-safe:animate-[flotar_7s_ease-in-out_infinite]"
                />
              </Link>
            </div>

            <div className="text-center">
              <BadgeSello sello={libro.sello} conEnlace />
              <h2 className="mt-4 font-titulares text-2xl leading-tight">
                <Link href={`/libro/${libro.slug}`} className="hover:text-marca-texto">
                  {libro.titulo}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-texto-tenue">
                {libro.subtitulo}
              </p>
              <p className="mt-4 text-sm text-texto-tenue">
                <span className="font-semibold text-texto">
                  PDF Premium {formatearPrecio(libro.precios.pdf)}
                </span>{" "}
                — {libro.promesaPdf}.
              </p>
              <EnlaceBoton
                href={`/libro/${libro.slug}`}
                variante="secundario"
                className="mt-6"
                conFlecha
              >
                Ver el libro
              </EnlaceBoton>
            </div>
          </Revelar>
        </div>

        {/* Captura de correo */}
        <Revelar retraso={200} className="lg:col-start-1 lg:row-start-2">
          <CapturaEmail recurso={RECURSO_PORTADA} />
        </Revelar>
      </Contenedor>
    </section>
  );
}
