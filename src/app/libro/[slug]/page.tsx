import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BarraCompraMovil } from "@/components/libros/BarraCompraMovil";
import { EntregablesLibro } from "@/components/libros/EntregablesLibro";
import { FaqLibro } from "@/components/libros/FaqLibro";
import { IndiceLibro } from "@/components/libros/IndiceLibro";
import { MuestraGratuita } from "@/components/libros/MuestraGratuita";
import { PortadaLibro } from "@/components/libros/PortadaLibro";
import { ResenasLibro } from "@/components/libros/ResenasLibro";
import { SelectorFormatos } from "@/components/libros/SelectorFormatos";
import { TarjetaLibro } from "@/components/libros/TarjetaLibro";
import { Mdx } from "@/components/mdx/Mdx";
import { DatosEstructurados } from "@/components/seo/DatosEstructurados";
import { BadgeSello } from "@/components/ui/BadgeSello";
import { EnlaceBoton } from "@/components/ui/Boton";
import { Contenedor } from "@/components/ui/Contenedor";
import { obtenerAutor } from "@/lib/contenido/autores";
import { librosRelacionados, obtenerLibro, todosLosLibros } from "@/lib/contenido/libros";
import { aTarjeta, etiquetaEstado } from "@/lib/contenido/tarjeta";
import { obtenerSello } from "@/lib/sellos";
import {
  faqJsonLd,
  grafoJsonLd,
  libroJsonLd,
  migasJsonLd,
  productoLibroJsonLd,
} from "@/lib/seo/jsonLd";
import { formatearFecha, formatearPrecio } from "@/lib/utils";

export function generateStaticParams() {
  return todosLosLibros().map((libro) => ({ slug: libro.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const libro = obtenerLibro(slug);

  if (!libro) return { title: "Libro no encontrado" };

  return {
    title: `${libro.titulo} — ${libro.subtitulo}`,
    description: libro.gancho.slice(0, 175),
    alternates: { canonical: `/libro/${libro.slug}` },
    openGraph: {
      type: "article",
      title: `${libro.titulo} · ${libro.autorNombre}`,
      description: libro.gancho.slice(0, 175),
      url: `/libro/${libro.slug}`,
    },
  };
}

export default async function PaginaLibro({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const libro = obtenerLibro(slug);

  if (!libro) notFound();

  const sello = obtenerSello(libro.sello);
  const autor = obtenerAutor(libro.autor);
  const relacionados = librosRelacionados(libro);
  const estado = etiquetaEstado(libro);

  return (
    <>
      {/* 1. Portada grande, sello, título, subtítulo y autor */}
      <section className="border-b border-borde bg-fondo-alterno">
        <Contenedor className="py-8 sm:py-12">
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
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/sellos/${sello.slug}`} className="hover:text-marca-texto">
                  {sello.nombre}
                </Link>
              </li>
            </ol>
          </nav>

          <div className="grid gap-8 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-14">
            <div className="mx-auto w-[62%] max-w-56 sm:mx-0 sm:w-full sm:max-w-none">
              <PortadaLibro
                libro={aTarjeta(libro)}
                prioridad
                sizes="(min-width: 1024px) 20rem, (min-width: 640px) 15rem, 62vw"
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <BadgeSello sello={libro.sello} conEnlace tamano="md" />
                {estado ? (
                  <span className="rounded-full border border-borde-fuerte px-3 py-1.5 text-xs font-semibold tracking-wider text-texto-tenue uppercase">
                    {estado}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">
                {libro.titulo}
              </h1>
              <p className="mt-3 font-titulares text-xl leading-snug text-texto-tenue sm:text-2xl">
                {libro.subtitulo}
              </p>

              <p className="mt-5 text-sm text-texto-tenue">
                <Link
                  href={`/autor/${libro.autor}`}
                  className="font-medium text-texto underline decoration-borde-fuerte underline-offset-2 hover:text-marca-texto"
                >
                  {libro.autorNombre}
                </Link>
                {" · "}
                {libro.paginas} páginas
                {" · "}
                {libro.estado === "publicado" ? "Publicado" : "Previsto"} el{" "}
                {formatearFecha(libro.fecha)}
              </p>

              <p className="mt-5 max-w-prose text-base leading-relaxed text-texto sm:text-lg">
                {libro.gancho}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <EnlaceBoton href={`/comprar/${libro.sku}`} tamano="lg">
                  Comprar el PDF Premium · {formatearPrecio(libro.precios.pdf)}
                </EnlaceBoton>
                <a
                  href="#titulo-formatos"
                  className="text-sm font-medium text-marca-texto underline underline-offset-2"
                >
                  Comparar los tres formatos
                </a>
              </div>
            </div>
          </div>
        </Contenedor>
      </section>

      <Contenedor className="flex flex-col gap-16 py-14 sm:gap-20 sm:py-16">
        {/* 2. Selector de formato */}
        <SelectorFormatos libro={libro} />

        {/* 3. Qué vas a poder hacer al terminarlo */}
        <section aria-labelledby="titulo-resultados" className="scroll-mt-24">
          <h2 id="titulo-resultados" className="text-2xl sm:text-3xl">
            Qué vas a poder hacer al terminarlo
          </h2>
          <p className="mt-2 text-texto-tenue">
            No es lo que vas a leer: es lo que vas a saber hacer el día que lo cierres.
          </p>

          <ul className="mt-6 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
            {libro.resultados.map((resultado) => (
              <li key={resultado} className="flex gap-3">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`mt-1 size-4 shrink-0 ${sello.clases.texto}`}
                >
                  <path d="m4 10.5 4 4 8-9" />
                </svg>
                <span className="text-[0.9375rem] leading-relaxed text-texto">
                  {resultado}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Descripción larga, del MDX */}
        <section aria-labelledby="titulo-sobre" className="scroll-mt-24">
          <h2 id="titulo-sobre" className="text-2xl sm:text-3xl">
            Sobre el libro
          </h2>
          <Mdx fuente={libro.cuerpo} className="mt-5 max-w-medida" />
        </section>

        {/* 4. Índice completo desplegable */}
        <IndiceLibro libro={libro} />

        {/* 5. Muestra gratuita */}
        <MuestraGratuita libro={libro} />

        {/* 6. Entregables */}
        <EntregablesLibro libro={libro} />

        {/* 7. Reseñas */}
        <ResenasLibro libro={libro} />

        {/* 8. Preguntas frecuentes */}
        <FaqLibro libro={libro} />

        {/* Último empujón, con las garantías delante */}
        <section className="rounded-lg border border-marca/30 bg-marca-suave p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl">
            {libro.titulo}, con todo lo que incluye
          </h2>
          <p className="mt-3 max-w-medida text-[0.9375rem] leading-relaxed text-texto">
            {libro.promesaPdf.charAt(0).toUpperCase() + libro.promesaPdf.slice(1)}.
            Descarga inmediata, actualizaciones durante doce meses y garantía de
            devolución de catorce días.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <EnlaceBoton href={`/comprar/${libro.sku}`} tamano="lg">
              Comprar por {formatearPrecio(libro.precios.pdf)}
            </EnlaceBoton>
            <Link
              href="/legal/terminos#reembolsos"
              className="text-sm text-texto-tenue underline hover:text-marca-texto"
            >
              Cómo funciona la garantía
            </Link>
          </div>
        </section>

        {/* 9. Venta cruzada */}
        {relacionados.length > 0 ? (
          <section aria-labelledby="titulo-relacionados">
            <h2 id="titulo-relacionados" className="text-2xl sm:text-3xl">
              Si te interesa este, mira estos
            </h2>
            <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((otro) => (
                <li key={otro.slug} className="flex">
                  <TarjetaLibro libro={aTarjeta(otro)} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Firma del autor */}
        {autor ? (
          <section className="flex flex-col gap-4 border-t border-borde pt-8 sm:flex-row sm:items-start sm:gap-6">
            <div className="min-w-0">
              <p className="ojo-titular">Sobre el autor</p>
              <h2 className="mt-2 text-xl">
                <Link href={`/autor/${autor.slug}`} className="hover:text-marca-texto">
                  {autor.nombre}
                </Link>
              </h2>
              <p className="mt-2 max-w-medida text-[0.9375rem] leading-relaxed text-texto-tenue">
                {autor.bioMedia}
              </p>
            </div>
          </section>
        ) : null}
      </Contenedor>

      {/* 10. Barra de compra pegajosa en móvil */}
      <BarraCompraMovil
        sku={libro.sku}
        titulo={libro.titulo}
        precio={formatearPrecio(libro.precios.pdf)}
      />

      <DatosEstructurados
        datos={grafoJsonLd(
          libroJsonLd(libro),
          productoLibroJsonLd(libro),
          faqJsonLd(libro),
          migasJsonLd([
            { nombre: "Inicio", ruta: "/" },
            { nombre: "Catálogo", ruta: "/catalogo" },
            { nombre: sello.nombre, ruta: `/sellos/${sello.slug}` },
            { nombre: libro.titulo, ruta: `/libro/${libro.slug}` },
          ]),
        )}
      />
    </>
  );
}
