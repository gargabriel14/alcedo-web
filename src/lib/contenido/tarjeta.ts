import type { Libro } from "@/lib/contenido/libros";
import type { ClaveSello } from "@/lib/sellos";

/**
 * Los datos mínimos para pintar una tarjeta de libro.
 *
 * Existe por una razón concreta: el catálogo filtra en el navegador, y para eso
 * los datos tienen que cruzar la frontera cliente/servidor. Si pasáramos el
 * `Libro` completo viajarían también el cuerpo MDX, el índice y las FAQ, que en
 * una tarjeta no se usan y en un catálogo de cuarenta libros serían cientos de kB.
 *
 * Este módulo **no importa nada de Node** (solo tipos, que desaparecen al
 * compilar), así que puede usarse desde un componente de cliente.
 */
export interface LibroTarjeta {
  slug: string;
  titulo: string;
  subtitulo: string;
  sello: ClaveSello;
  autorNombre: string;
  estado: "publicado" | "en-preparacion";
  precioPdf: number;
  precioKindle: number;
  portada: { src: string; alt: string } | null;
  /** Temas del libro, para el filtro del catálogo. */
  temas: readonly string[];
  /** Formatos en los que existe, para el filtro del catálogo. */
  formatos: readonly FormatoLibro[];
}

export const FORMATOS = ["pdf", "kindle", "tapa-blanda"] as const;
export type FormatoLibro = (typeof FORMATOS)[number];

export const ETIQUETAS_FORMATO: Record<FormatoLibro, string> = {
  pdf: "PDF Premium",
  kindle: "Kindle",
  "tapa-blanda": "Tapa blanda",
};

export function aTarjeta(libro: Libro): LibroTarjeta {
  const formatos: FormatoLibro[] = ["pdf", "kindle"];
  if (libro.precios.tapaBlanda !== undefined) formatos.push("tapa-blanda");

  return {
    slug: libro.slug,
    titulo: libro.titulo,
    subtitulo: libro.subtitulo,
    sello: libro.sello,
    autorNombre: libro.autorNombre,
    estado: libro.estado,
    precioPdf: libro.precios.pdf,
    precioKindle: libro.precios.kindle,
    portada: libro.portada
      ? { src: libro.portada.src, alt: libro.portada.alt }
      : null,
    temas: libro.temas,
    formatos,
  };
}

/** Etiqueta del estado, o `null` si no hace falta avisar de nada. */
export function etiquetaEstado(libro: Pick<LibroTarjeta, "estado">): string | null {
  return libro.estado === "en-preparacion" ? "En preparación" : null;
}
