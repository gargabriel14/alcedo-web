/**
 * Registro de rutas indexables.
 *
 * El sitemap se genera a partir de aquí. Solo entran páginas que existen de
 * verdad y que queremos en Google: las páginas puente de las secciones aún no
 * construidas llevan `noindex`, así que no aparecen. En la Fase 2 este registro
 * se amplía leyendo los MDX de libros, artículos, sellos y autores.
 */

export interface RutaIndexable {
  ruta: string;
  prioridad: number;
  frecuencia: "daily" | "weekly" | "monthly" | "yearly";
}

export const RUTAS_INDEXABLES: readonly RutaIndexable[] = [
  { ruta: "/", prioridad: 1, frecuencia: "weekly" },
] as const;
