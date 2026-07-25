import { esquemaAutor, type FrontmatterAutor } from "@/lib/contenido/esquemas";
import { leerColeccion } from "@/lib/contenido/mdx";

export type Autor = FrontmatterAutor & {
  slug: string;
  /** Biografía larga en MDX, por párrafos. */
  cuerpo: string;
};

const COLECCION = "autores";

export function todosLosAutores(): Autor[] {
  return leerColeccion(COLECCION, esquemaAutor).map(({ slug, datos, cuerpo }) => ({
    slug,
    ...datos,
    cuerpo,
  }));
}

export function obtenerAutor(slug: string): Autor | undefined {
  return todosLosAutores().find((autor) => autor.slug === slug);
}

/**
 * El autor insignia. Se usa cuando hay que firmar algo del sitio y no de un
 * libro concreto.
 */
export function autorPrincipal(): Autor {
  return todosLosAutores()[0]!;
}
