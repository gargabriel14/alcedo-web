import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DatosEstructurados } from "@/components/seo/DatosEstructurados";
import { Contenedor } from "@/components/ui/Contenedor";
import { todosLosAutores } from "@/lib/contenido/autores";
import { librosDelAutor } from "@/lib/contenido/libros";
import { obtenerSello } from "@/lib/sellos";
import { grafoJsonLd, migasJsonLd } from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "Autores",
  description:
    "Quién escribe en Editorial Alcedo. Autores de no-ficción práctica que publican sobre lo que han tenido que resolver de verdad.",
  alternates: { canonical: "/autores" },
};

export default function PaginaAutores() {
  const autores = todosLosAutores();

  return (
    <>
      <section className="border-b border-borde bg-fondo-alterno">
        <Contenedor className="py-10 sm:py-14">
          <p className="ojo-titular">Autores</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Quién escribe aquí</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-texto-tenue">
            Publicamos a quien ha resuelto el problema del que escribe. Nada de firmas
            de encargo.
          </p>
        </Contenedor>
      </section>

      <Contenedor className="py-10 sm:py-14">
        <ul className="flex flex-col gap-8">
          {autores.map((autor) => {
            const libros = librosDelAutor(autor.slug);

            return (
              <li key={autor.slug}>
                <article className="group relative flex flex-col gap-5 rounded-lg border border-borde bg-superficie p-5 sm:flex-row sm:gap-7 sm:p-6">
                  {autor.foto ? (
                    <Image
                      src={autor.foto.src}
                      alt=""
                      width={autor.foto.ancho}
                      height={autor.foto.alto}
                      unoptimized={autor.foto.src.endsWith(".svg")}
                      className="size-24 shrink-0 rounded-full object-cover sm:size-28"
                    />
                  ) : null}

                  <div className="min-w-0">
                    <h2 className="text-2xl">
                      <Link href={`/autor/${autor.slug}`} className="hover:text-marca-texto">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {autor.nombre}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-texto-tenue">{autor.rol}</p>
                    <p className="mt-3 max-w-medida leading-relaxed text-texto-tenue">
                      {autor.bioMedia}
                    </p>

                    <p className="mt-4 text-sm text-texto-tenue">
                      {libros.length}{" "}
                      {libros.length === 1 ? "libro publicado" : "libros en el catálogo"}
                      {autor.sellos.length > 0
                        ? ` · ${autor.sellos.map((sello) => obtenerSello(sello).nombre).join(" y ")}`
                        : ""}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </Contenedor>

      <DatosEstructurados
        datos={grafoJsonLd(
          migasJsonLd([
            { nombre: "Inicio", ruta: "/" },
            { nombre: "Autores", ruta: "/autores" },
          ]),
        )}
      />
    </>
  );
}
