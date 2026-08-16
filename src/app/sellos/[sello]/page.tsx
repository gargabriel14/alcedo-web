import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TarjetaLibro } from "@/components/libros/TarjetaLibro";
import { DatosEstructurados } from "@/components/seo/DatosEstructurados";
import { Contenedor } from "@/components/ui/Contenedor";
import { articulosDelSello } from "@/lib/contenido/blog";
import { librosDelSello } from "@/lib/contenido/libros";
import { aTarjeta } from "@/lib/contenido/tarjeta";
import { LISTA_SELLOS, SELLOS, type ClaveSello } from "@/lib/sellos";
import { grafoJsonLd, migasJsonLd } from "@/lib/seo/jsonLd";
import { componerTitulo, recortarDescripcion } from "@/lib/seo/texto";
import { formatearFecha } from "@/lib/utils";

export function generateStaticParams() {
  return LISTA_SELLOS.map((sello) => ({ sello: sello.slug }));
}

function esClaveSello(valor: string): valor is ClaveSello {
  return valor in SELLOS;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sello: string }>;
}): Promise<Metadata> {
  const { sello } = await params;
  if (!esClaveSello(sello)) return { title: "Sello no encontrado" };

  const datos = SELLOS[sello];

  return {
    // Solo el nombre del sello: con el lema detrás se iba a 80 caracteres y
    // Google cortaba justo por el lema.
    title: componerTitulo(datos.nombre),
    description: recortarDescripcion(`${datos.lema}. ${datos.descripcion}`),
    alternates: { canonical: `/sellos/${datos.slug}` },
    openGraph: {
      title: `${datos.nombre} · Editorial Alcedo`,
      description: datos.lema,
      url: `/sellos/${datos.slug}`,
    },
  };
}

export default async function PaginaSello({
  params,
}: {
  params: Promise<{ sello: string }>;
}) {
  const { sello } = await params;
  if (!esClaveSello(sello)) notFound();

  const datos = SELLOS[sello];
  const libros = librosDelSello(sello).map(aTarjeta);
  const articulos = articulosDelSello(sello);

  return (
    <>
      {/* Cabecera con el color del sello */}
      <section className="relative border-b border-borde bg-fondo-alterno">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ backgroundColor: datos.hex }}
        />
        <Contenedor className="py-12 sm:py-16">
          <nav aria-label="Migas de pan" className="mb-6 text-xs text-texto-tenue">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-marca-texto">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/catalogo" className="hover:text-marca-texto">
                  Catálogo
                </Link>
              </li>
            </ol>
          </nav>

          <p className="ojo-titular">Sello editorial</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">{datos.nombre}</h1>
          <p className={`mt-3 font-titulares text-xl sm:text-2xl ${datos.clases.texto}`}>
            {datos.lema}
          </p>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-texto-tenue">
            {datos.descripcion}
          </p>
        </Contenedor>
      </section>

      <Contenedor className="py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl">
          {libros.length === 1
            ? "Un libro en este sello"
            : `${libros.length} libros en este sello`}
        </h2>

        {libros.length > 0 ? (
          <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {libros.map((libro, indice) => (
              <li key={libro.slug} className="flex">
                <TarjetaLibro libro={libro} sinSello prioridad={indice === 0} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 rounded-lg border border-dashed border-borde-fuerte p-8 text-center text-texto-tenue">
            Todavía no hay libros publicados en este sello. Estamos en ello.
          </p>
        )}

        {articulos.length > 0 ? (
          <section aria-labelledby="titulo-articulos-sello" className="mt-16">
            <h2 id="titulo-articulos-sello" className="text-2xl sm:text-3xl">
              Artículos de {datos.nombre}
            </h2>
            <ul className="mt-6 divide-y divide-borde border-y border-borde">
              {articulos.map((articulo) => (
                <li key={articulo.slug}>
                  <Link
                    href={`/blog/${articulo.slug}`}
                    className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <span className="shrink-0 text-xs text-texto-tenue tabular-nums sm:w-32">
                      {formatearFecha(articulo.fecha)}
                    </span>
                    <span className="font-titulares text-lg leading-snug font-semibold text-texto group-hover:text-marca-texto">
                      {articulo.titulo}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Contenedor>

      <DatosEstructurados
        datos={grafoJsonLd(
          migasJsonLd([
            { nombre: "Inicio", ruta: "/" },
            { nombre: "Catálogo", ruta: "/catalogo" },
            { nombre: datos.nombre, ruta: `/sellos/${datos.slug}` },
          ]),
        )}
      />
    </>
  );
}
