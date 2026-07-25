import type { Metadata } from "next";
import Link from "next/link";
import { DatosEstructurados } from "@/components/seo/DatosEstructurados";
import { BadgeSello } from "@/components/ui/BadgeSello";
import { Contenedor } from "@/components/ui/Contenedor";
import { articulosPublicados } from "@/lib/contenido/blog";
import { grafoJsonLd, migasJsonLd } from "@/lib/seo/jsonLd";
import { formatearFecha } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artículos prácticos de Editorial Alcedo: Excel e IA para autónomos, impuestos, hogar y plantas. Cada uno resuelve una duda concreta y termina en algo que puedes usar.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog de Editorial Alcedo",
    description:
      "Artículos prácticos que resuelven una duda concreta, sin relleno.",
    url: "/blog",
  },
};

export default function PaginaBlog() {
  const articulos = articulosPublicados();

  return (
    <>
      <section className="border-b border-borde bg-fondo-alterno">
        <Contenedor className="py-10 sm:py-14">
          <p className="ojo-titular">Blog</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Artículos que resuelven algo</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-texto-tenue">
            Aquí no hay noticias del sector ni reflexiones. Cada artículo coge una duda
            concreta, la resuelve entera y te dice qué libro la desarrolla en
            profundidad si te has quedado con ganas.
          </p>
        </Contenedor>
      </section>

      <Contenedor className="py-10 sm:py-14">
        <ul className="grid gap-6 sm:grid-cols-2">
          {articulos.map((articulo) => (
            <li key={articulo.slug} className="group relative flex">
              <article className="flex flex-1 flex-col rounded-lg border border-borde bg-superficie p-5 transition-shadow hover:shadow-tarjeta sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <BadgeSello sello={articulo.sello} />
                  <span className="text-xs text-texto-tenue">
                    {formatearFecha(articulo.fecha)} · {articulo.minutos} min de lectura
                  </span>
                </div>

                <h2 className="mt-3 text-xl leading-snug sm:text-2xl">
                  <Link href={`/blog/${articulo.slug}`} className="hover:text-marca-texto">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {articulo.titulo}
                  </Link>
                </h2>

                <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-texto-tenue">
                  {articulo.descripcion}
                </p>

                <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-marca-texto">
                  Leer el artículo
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </p>
              </article>
            </li>
          ))}
        </ul>
      </Contenedor>

      <DatosEstructurados
        datos={grafoJsonLd(
          migasJsonLd([
            { nombre: "Inicio", ruta: "/" },
            { nombre: "Blog", ruta: "/blog" },
          ]),
        )}
      />
    </>
  );
}
