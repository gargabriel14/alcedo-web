import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TarjetaLibro } from "@/components/libros/TarjetaLibro";
import { Mdx } from "@/components/mdx/Mdx";
import { DatosEstructurados } from "@/components/seo/DatosEstructurados";
import { Contenedor } from "@/components/ui/Contenedor";
import { obtenerAutor, todosLosAutores } from "@/lib/contenido/autores";
import { articulosPublicados } from "@/lib/contenido/blog";
import { librosDelAutor } from "@/lib/contenido/libros";
import { aTarjeta } from "@/lib/contenido/tarjeta";
import { grafoJsonLd, migasJsonLd, personaJsonLd } from "@/lib/seo/jsonLd";
import { formatearFecha } from "@/lib/utils";

export function generateStaticParams() {
  return todosLosAutores().map((autor) => ({ slug: autor.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const autor = obtenerAutor(slug);

  if (!autor) return { title: "Autor no encontrado" };

  return {
    title: `${autor.nombre} — ${autor.rol}`,
    description: autor.bioCorta,
    alternates: { canonical: `/autor/${autor.slug}` },
    openGraph: {
      type: "profile",
      title: autor.nombre,
      description: autor.bioCorta,
      url: `/autor/${autor.slug}`,
    },
  };
}

export default async function PaginaAutor({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const autor = obtenerAutor(slug);

  if (!autor) notFound();

  const libros = librosDelAutor(autor.slug).map(aTarjeta);
  const articulos = articulosPublicados().filter(
    (articulo) => articulo.autor === autor.slug,
  );

  return (
    <>
      <section className="border-b border-borde bg-fondo-alterno">
        <Contenedor className="py-10 sm:py-14">
          <nav aria-label="Migas de pan" className="mb-6 text-xs text-texto-tenue">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-marca-texto">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/autores" className="hover:text-marca-texto">
                  Autores
                </Link>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            {autor.foto ? (
              <Image
                src={autor.foto.src}
                alt={autor.foto.alt}
                width={autor.foto.ancho}
                height={autor.foto.alto}
                priority
                unoptimized={autor.foto.src.endsWith(".svg")}
                className="size-28 shrink-0 rounded-full object-cover sm:size-36"
              />
            ) : null}

            <div className="min-w-0">
              <p className="ojo-titular">{autor.rol}</p>
              <h1 className="mt-2 text-4xl sm:text-5xl">{autor.nombre}</h1>
              <p className="mt-4 max-w-medida text-lg leading-relaxed text-texto-tenue">
                {autor.bioMedia}
              </p>
            </div>
          </div>
        </Contenedor>
      </section>

      <Contenedor className="py-12 sm:py-16">
        <Mdx fuente={autor.cuerpo} className="max-w-medida" />

        {libros.length > 0 ? (
          <section aria-labelledby="titulo-libros-autor" className="mt-16">
            <h2 id="titulo-libros-autor" className="text-2xl sm:text-3xl">
              Sus libros
            </h2>
            <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {libros.map((libro) => (
                <li key={libro.slug} className="flex">
                  <TarjetaLibro libro={libro} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {articulos.length > 0 ? (
          <section aria-labelledby="titulo-articulos-autor" className="mt-16">
            <h2 id="titulo-articulos-autor" className="text-2xl sm:text-3xl">
              Sus artículos
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
          personaJsonLd(autor),
          migasJsonLd([
            { nombre: "Inicio", ruta: "/" },
            { nombre: "Autores", ruta: "/autores" },
            { nombre: autor.nombre, ruta: `/autor/${autor.slug}` },
          ]),
        )}
      />
    </>
  );
}
