import type { Metadata } from "next";
import Link from "next/link";
import { DatosEstructurados } from "@/components/seo/DatosEstructurados";
import { BadgeSello } from "@/components/ui/BadgeSello";
import { Contenedor } from "@/components/ui/Contenedor";
import { RECURSOS } from "@/lib/datos/recursos";
import { grafoJsonLd, migasJsonLd } from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "Recursos gratis",
  description:
    "Plantillas y guías descargables de Editorial Alcedo: IVA trimestral para autónomos, calculadora de precio por hora y mapa de luz para plantas. Gratis, a cambio de tu correo.",
  alternates: { canonical: "/recursos" },
  openGraph: {
    title: "Recursos gratuitos de Editorial Alcedo",
    description:
      "Plantillas listas para usar. Gratis, sin coste y sin letra pequeña.",
    url: "/recursos",
  },
};

export default function PaginaRecursos() {
  return (
    <>
      <section className="border-b border-borde bg-fondo-alterno">
        <Contenedor className="py-10 sm:py-14">
          <p className="ojo-titular">Recursos gratis</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Plantillas que puedes usar hoy</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-texto-tenue">
            No son adelantos ni resúmenes: son ficheros terminados, los mismos que
            acompañan a nuestros libros. Te los damos a cambio de tu correo, y te
            escribimos solo cuando publicamos algo que te sirva.
          </p>
        </Contenedor>
      </section>

      <Contenedor className="py-10 sm:py-14">
        <ul className="grid gap-6 sm:grid-cols-2">
          {RECURSOS.map((recurso) => (
            <li key={recurso.slug} className="group relative flex">
              <article className="flex flex-1 flex-col rounded-lg border border-borde bg-superficie p-5 transition-shadow hover:shadow-tarjeta sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <BadgeSello sello={recurso.sello} />
                  {recurso.formatos.map((formato) => (
                    <span
                      key={formato}
                      className="rounded-full border border-borde px-2.5 py-1 text-xs font-medium text-texto-tenue"
                    >
                      {formato}
                    </span>
                  ))}
                </div>

                <h2 className="mt-3 text-xl leading-snug">
                  <Link
                    href={`/recursos/${recurso.slug}`}
                    className="hover:text-marca-texto"
                  >
                    <span className="absolute inset-0" aria-hidden="true" />
                    {recurso.titulo}
                  </Link>
                </h2>

                <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-texto-tenue">
                  {recurso.gancho}
                </p>

                <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-marca-texto">
                  Descargar gratis
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
            { nombre: "Recursos gratis", ruta: "/recursos" },
          ]),
        )}
      />
    </>
  );
}
