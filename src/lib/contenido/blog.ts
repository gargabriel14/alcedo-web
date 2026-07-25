import { esquemaArticulo, type FrontmatterArticulo } from "@/lib/contenido/esquemas";
import { extraerIndice, minutosDeLectura, type EntradaIndice } from "@/lib/contenido/indice";
import { leerColeccion } from "@/lib/contenido/mdx";
import type { ClaveSello } from "@/lib/sellos";

export type Articulo = FrontmatterArticulo & {
  slug: string;
  cuerpo: string;
  /** Índice lateral, calculado de los titulares del cuerpo. */
  indice: EntradaIndice[];
  minutos: number;
};

const COLECCION = "blog";

function normalizar(): Articulo[] {
  return leerColeccion(COLECCION, esquemaArticulo)
    .map(({ slug, datos, cuerpo }) => ({
      slug,
      ...datos,
      cuerpo,
      indice: extraerIndice(cuerpo),
      minutos: minutosDeLectura(cuerpo),
    }))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

/**
 * Artículos publicados, del más reciente al más antiguo.
 * Los marcados como `borrador: true` no salen ni en el listado ni en el sitemap,
 * pero sí se pueden ver en local por su URL mientras se escriben.
 */
export function articulosPublicados(): Articulo[] {
  return normalizar().filter((articulo) => !articulo.borrador);
}

/** Incluye borradores: solo para `generateStaticParams` en desarrollo. */
export function todosLosArticulos(): Articulo[] {
  return normalizar();
}

export function obtenerArticulo(slug: string): Articulo | undefined {
  return normalizar().find((articulo) => articulo.slug === slug);
}

export function articulosDelSello(sello: ClaveSello): Articulo[] {
  return articulosPublicados().filter((articulo) => articulo.sello === sello);
}

/** Artículos que empujan a un libro concreto. Se usan en su ficha. */
export function articulosDelLibro(slugLibro: string): Articulo[] {
  return articulosPublicados().filter(
    (articulo) => articulo.libroRelacionado === slugLibro,
  );
}
