import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CapturaEmail } from "@/components/formularios/CapturaEmail";
import { PortadaLibro } from "@/components/libros/PortadaLibro";
import { DatosEstructurados } from "@/components/seo/DatosEstructurados";
import { BadgeSello } from "@/components/ui/BadgeSello";
import { EnlaceBoton } from "@/components/ui/Boton";
import { Contenedor } from "@/components/ui/Contenedor";
import { obtenerLibro } from "@/lib/contenido/libros";
import { aTarjeta } from "@/lib/contenido/tarjeta";
import { obtenerRecurso, RECURSOS } from "@/lib/datos/recursos";
import { grafoJsonLd, migasJsonLd } from "@/lib/seo/jsonLd";

export function generateStaticParams() {
  return RECURSOS.map((recurso) => ({ slug: recurso.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recurso = obtenerRecurso(slug);

  if (!recurso) return { title: "Recurso no encontrado" };

  return {
    title: `${recurso.titulo} — descarga gratis`,
    description: recurso.gancho.slice(0, 175),
    alternates: { canonical: `/recursos/${recurso.slug}` },
    openGraph: {
      title: `${recurso.titulo} · gratis`,
      description: recurso.gancho.slice(0, 175),
      url: `/recursos/${recurso.slug}`,
    },
  };
}

/**
 * Landing de un lead magnet.
 *
 * Es una página indexable y con su propia URL a propósito: cada plantilla puede
 * posicionar por su cuenta («plantilla iva trimestral autónomos excel») y ser el
 * destino de un vídeo o de un enlace en el blog. Una sola página de «suscríbete»
 * no posiciona por nada.
 *
 * Una sola llamada a la acción en toda la página. Sin menú de distracciones.
 */
export default async function PaginaRecurso({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recurso = obtenerRecurso(slug);

  if (!recurso) notFound();

  const libro = obtenerLibro(recurso.libroRelacionado);

  return (
    <>
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
              <Link href="/recursos" className="hover:text-marca-texto">
                Recursos gratis
              </Link>
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
          <div>
            <BadgeSello sello={recurso.sello} conEnlace />
            <h1 className="mt-4 text-3xl leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
              {recurso.titulo}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-texto-tenue">
              {recurso.gancho}
            </p>

            <h2 className="mt-8 text-lg">Qué incluye</h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {recurso.incluye.map((linea) => (
                <li key={linea} className="flex gap-3">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-1 size-4 shrink-0 text-marca"
                  >
                    <path d="m4 10.5 4 4 8-9" />
                  </svg>
                  <span className="text-[0.9375rem] leading-relaxed text-texto">
                    {linea}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-sm leading-relaxed text-texto-tenue">
              Es gratis de verdad: no hay versión de pago de esta plantilla ni te va a
              llegar una llamada. Si algún día te cansas de nosotros, te das de baja
              en un clic.
            </p>
          </div>

          <div className="lg:sticky lg:top-24">
            <CapturaEmail recurso={recurso} textoBoton="Descargar gratis" />
          </div>
        </div>
      </Contenedor>

      {libro ? (
        <section className="border-t border-borde bg-fondo-alterno py-12 sm:py-16">
          <Contenedor>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
              <div className="w-32 shrink-0 sm:w-40">
                <PortadaLibro
                  libro={aTarjeta(libro)}
                  decorativa
                  sizes="(min-width: 640px) 10rem, 8rem"
                />
              </div>

              <div className="min-w-0">
                <p className="ojo-titular">De dónde sale esta plantilla</p>
                <h2 className="mt-2 text-2xl">{libro.titulo}</h2>
                <p className="mt-2 max-w-medida leading-relaxed text-texto-tenue">
                  {libro.gancho}
                </p>
                <EnlaceBoton href={`/libro/${libro.slug}`} className="mt-5">
                  Ver el libro
                </EnlaceBoton>
              </div>
            </div>
          </Contenedor>
        </section>
      ) : null}

      <DatosEstructurados
        datos={grafoJsonLd(
          migasJsonLd([
            { nombre: "Inicio", ruta: "/" },
            { nombre: "Recursos gratis", ruta: "/recursos" },
            { nombre: recurso.titulo, ruta: `/recursos/${recurso.slug}` },
          ]),
        )}
      />
    </>
  );
}
