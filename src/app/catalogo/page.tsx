import type { Metadata } from "next";
import { FiltrosCatalogo } from "@/components/catalogo/FiltrosCatalogo";
import { DatosEstructurados } from "@/components/seo/DatosEstructurados";
import { Contenedor } from "@/components/ui/Contenedor";
import { temasDisponibles, todosLosLibros } from "@/lib/contenido/libros";
import { aTarjeta } from "@/lib/contenido/tarjeta";
import { grafoJsonLd, migasJsonLd } from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "Catálogo de libros",
  description:
    "Todas las guías prácticas de Editorial Alcedo, por sello, tema y formato. El PDF Premium incluye siempre las plantillas editables; el Kindle, no.",
  alternates: { canonical: "/catalogo" },
  openGraph: {
    title: "Catálogo de Editorial Alcedo",
    description:
      "Guías prácticas ilustradas con plantillas listas para usar. Filtra por sello, tema y formato.",
    url: "/catalogo",
  },
};

export default function PaginaCatalogo() {
  const libros = todosLosLibros().map(aTarjeta);
  const temas = temasDisponibles();

  return (
    <>
      <section className="border-b border-borde bg-fondo-alterno">
        <Contenedor className="py-10 sm:py-14">
          <p className="ojo-titular">Catálogo</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Todos nuestros libros</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-texto-tenue">
            Publicamos poco y muy dirigido: cada título resuelve un problema concreto y
            termina en un fichero que puedes usar. Aquí están todos, incluidos los que
            están en imprenta.
          </p>
        </Contenedor>
      </section>

      <Contenedor className="py-10 sm:py-14">
        <FiltrosCatalogo libros={libros} temas={temas} />
      </Contenedor>

      <DatosEstructurados
        datos={grafoJsonLd(
          migasJsonLd([
            { nombre: "Inicio", ruta: "/" },
            { nombre: "Catálogo", ruta: "/catalogo" },
          ]),
        )}
      />
    </>
  );
}
