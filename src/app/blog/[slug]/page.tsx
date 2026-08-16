import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CapturaEmail } from "@/components/formularios/CapturaEmail";
import { PortadaLibro } from "@/components/libros/PortadaLibro";
import { Mdx } from "@/components/mdx/Mdx";
import { DatosEstructurados } from "@/components/seo/DatosEstructurados";
import { BadgeSello } from "@/components/ui/BadgeSello";
import { EnlaceBoton } from "@/components/ui/Boton";
import { Contenedor } from "@/components/ui/Contenedor";
import { obtenerArticulo, todosLosArticulos, type Articulo } from "@/lib/contenido/blog";
import { obtenerAutor } from "@/lib/contenido/autores";
import { obtenerLibro } from "@/lib/contenido/libros";
import { aTarjeta } from "@/lib/contenido/tarjeta";
import { obtenerRecurso } from "@/lib/datos/recursos";
import { articuloJsonLd, grafoJsonLd, migasJsonLd } from "@/lib/seo/jsonLd";
import { componerTitulo, recortarDescripcion } from "@/lib/seo/texto";
import { formatearFecha, formatearPrecio } from "@/lib/utils";

export function generateStaticParams() {
  // Incluye borradores: así se pueden revisar por su URL antes de publicarlos.
  // Van con `noindex`, y no salen ni en el listado ni en el sitemap.
  return todosLosArticulos().map((articulo) => ({ slug: articulo.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const articulo = obtenerArticulo(slug);

  if (!articulo) return { title: "Artículo no encontrado" };

  const autor = obtenerAutor(articulo.autor);

  return {
    // Los titulares de artículo son largos por naturaleza: si el nombre de la
    // editorial no cabe, se cae, porque quien busca necesita ver el titular.
    title: componerTitulo(articulo.tituloSeo ?? articulo.titulo),
    description: recortarDescripcion(articulo.descripcion),
    alternates: { canonical: `/blog/${articulo.slug}` },
    ...(articulo.borrador ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "article",
      title: articulo.titulo,
      description: articulo.descripcion,
      url: `/blog/${articulo.slug}`,
      publishedTime: articulo.fecha,
      modifiedTime: articulo.actualizado ?? articulo.fecha,
      authors: autor ? [autor.nombre] : undefined,
    },
  };
}

export default async function PaginaArticulo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articulo = obtenerArticulo(slug);

  if (!articulo) notFound();

  const autor = obtenerAutor(articulo.autor);
  const libro = obtenerLibro(articulo.libroRelacionado);
  const recurso = articulo.recursoRelacionado
    ? obtenerRecurso(articulo.recursoRelacionado)
    : undefined;

  /**
   * `<Captura />` dentro del MDX: el autor escribe la etiqueta donde quiera del
   * artículo y aquí se resuelve al lead magnet declarado en el frontmatter. Si el
   * artículo no declara ninguno, la etiqueta no pinta nada en vez de romper.
   */
  const componentesMdx = {
    Captura: () =>
      recurso ? (
        <CapturaEmail
          recurso={recurso}
          variante="insertada"
          textoBoton="Descargar gratis"
        />
      ) : null,
  };

  return (
    <>
      <Contenedor className="py-8 sm:py-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
          <article className="min-w-0">
            <nav aria-label="Migas de pan" className="mb-6 text-xs text-texto-tenue">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link href="/" className="hover:text-marca-texto">
                    Inicio
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/blog" className="hover:text-marca-texto">
                    Blog
                  </Link>
                </li>
              </ol>
            </nav>

            <header className="max-w-medida">
              <BadgeSello sello={articulo.sello} conEnlace />
              <h1 className="mt-4 text-3xl leading-[1.15] sm:text-4xl lg:text-[2.75rem]">
                {articulo.titulo}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-texto-tenue">
                {articulo.descripcion}
              </p>

              <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-texto-tenue">
                {autor ? (
                  <Link
                    href={`/autor/${autor.slug}`}
                    className="font-medium text-texto underline decoration-borde-fuerte underline-offset-2 hover:text-marca-texto"
                  >
                    {autor.nombre}
                  </Link>
                ) : null}
                <span aria-hidden="true">·</span>
                <time dateTime={articulo.fecha}>{formatearFecha(articulo.fecha)}</time>
                <span aria-hidden="true">·</span>
                <span>{articulo.minutos} min de lectura</span>
              </p>

              {articulo.actualizado ? (
                <p className="mt-1 text-xs text-texto-tenue">
                  Actualizado el {formatearFecha(articulo.actualizado)}
                </p>
              ) : null}
            </header>

            {/* Índice en móvil, plegado */}
            {articulo.indice.length > 2 ? (
              <details className="mt-8 rounded-lg border border-borde bg-superficie-tenue lg:hidden">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-texto">
                  Contenido del artículo
                </summary>
                <IndiceArticulo articulo={articulo} className="px-4 pt-1 pb-4" />
              </details>
            ) : null}

            <Mdx
              fuente={articulo.cuerpo}
              componentes={componentesMdx}
              className="mt-10 max-w-medida"
            />

            {/* Cierre: siempre hacia el libro que desarrolla el tema */}
            {libro ? (
              <aside className="mt-14 rounded-lg border border-borde bg-fondo-alterno p-5 sm:p-6">
                <p className="ojo-titular">El libro que lo desarrolla entero</p>
                <div className="mt-4 flex gap-5 sm:gap-6">
                  <Link
                    href={`/libro/${libro.slug}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="w-[30%] max-w-36 shrink-0"
                  >
                    <PortadaLibro
                      libro={aTarjeta(libro)}
                      decorativa
                      sizes="(min-width: 640px) 9rem, 30vw"
                    />
                  </Link>

                  <div className="min-w-0">
                    <h2 className="text-xl leading-snug">
                      <Link
                        href={`/libro/${libro.slug}`}
                        className="hover:text-marca-texto"
                      >
                        {libro.titulo}
                      </Link>
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-texto-tenue">
                      {libro.subtitulo}
                    </p>
                    <p className="mt-3 text-sm text-texto-tenue">
                      <span className="font-semibold text-texto">
                        PDF Premium {formatearPrecio(libro.precios.pdf)}
                      </span>{" "}
                      — {libro.promesaPdf}.
                    </p>
                    <EnlaceBoton
                      href={`/libro/${libro.slug}`}
                      tamano="md"
                      className="mt-4"
                    >
                      Ver el libro
                    </EnlaceBoton>
                  </div>
                </div>
              </aside>
            ) : null}
          </article>

          {/* Índice lateral en escritorio */}
          {articulo.indice.length > 2 ? (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="ojo-titular">En este artículo</p>
                <IndiceArticulo articulo={articulo} className="mt-3" />
              </div>
            </aside>
          ) : null}
        </div>
      </Contenedor>

      <DatosEstructurados
        datos={grafoJsonLd(
          articuloJsonLd(articulo, autor?.nombre ?? "Editorial Alcedo"),
          migasJsonLd([
            { nombre: "Inicio", ruta: "/" },
            { nombre: "Blog", ruta: "/blog" },
            { nombre: articulo.titulo, ruta: `/blog/${articulo.slug}` },
          ]),
        )}
      />
    </>
  );
}

/**
 * Índice del artículo.
 *
 * Enlaces normales a las anclas que pone `rehype-slug`: sin JavaScript, sin
 * scroll-spy y sin sorpresas. El salto queda bien porque `.prosa h2` reserva
 * espacio con `scroll-margin-top` para la cabecera fija.
 */
function IndiceArticulo({
  articulo,
  className,
}: {
  articulo: Articulo;
  className?: string;
}) {
  return (
    <nav aria-label="Contenido del artículo" className={className}>
      <ol className="flex flex-col gap-2 border-l border-borde">
        {articulo.indice.map((entrada) => (
          <li
            key={entrada.id}
            className={entrada.nivel === 3 ? "pl-7 text-[0.8125rem]" : "pl-4 text-sm"}
          >
            <a
              href={`#${entrada.id}`}
              className="text-texto-tenue transition-colors hover:text-marca-texto"
            >
              {entrada.texto}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
