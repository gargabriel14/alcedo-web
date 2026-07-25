/**
 * Rutas estáticas indexables.
 *
 * Solo entran páginas que existen de verdad y que queremos en Google. Las páginas
 * puente de las secciones aún no construidas llevan `noindex`, así que no
 * aparecen aquí: un sitemap que anuncia páginas `noindex` es una señal
 * contradictoria y gasta presupuesto de rastreo.
 *
 * Las rutas de contenido (libros, artículos, sellos, autores) las añade el
 * sitemap leyendo `/content`.
 */

export interface RutaIndexable {
  ruta: string;
  prioridad: number;
  frecuencia: "daily" | "weekly" | "monthly" | "yearly";
}

export const RUTAS_ESTATICAS: readonly RutaIndexable[] = [
  { ruta: "/", prioridad: 1, frecuencia: "weekly" },
  { ruta: "/catalogo", prioridad: 0.9, frecuencia: "weekly" },
  { ruta: "/blog", prioridad: 0.8, frecuencia: "weekly" },
  { ruta: "/autores", prioridad: 0.5, frecuencia: "monthly" },
] as const;
