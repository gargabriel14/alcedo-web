import type { ClaveSello } from "@/lib/sellos";

/**
 * TODO(contenido) — Autores. Pasa a `/content/autores/*.mdx` en la Fase 2.
 *
 * REGLA DE MARCA: en público se muestra **solo «G. G. Alcedo»**. El nombre
 * completo no aparece en ningún texto, metadato ni dato estructurado del sitio.
 *
 * La bio está escrita para vender: cuenta de dónde viene la autoridad y qué se
 * lleva el lector. Antes de publicarla, revisa que cada afirmación sea cierta
 * para ti: es un borrador de agencia, no un currículum verificado.
 */

export interface Autor {
  slug: string;
  /** El único nombre que se muestra. */
  nombre: string;
  rol: string;
  /** Una línea, para tarjetas y pies de artículo. */
  bioCorta: string;
  /** Dos o tres frases, para la home y la ficha de libro. */
  bioMedia: string;
  /** Párrafos de la página del autor. */
  bioLarga: readonly string[];
  /**
   * Retrato. Sustituir el SVG provisional por una foto (JPG o WebP, cuadrada,
   * mínimo 800 px) manteniendo la ruta o cambiando solo esta línea.
   */
  foto: { src: string; alt: string; ancho: number; alto: number } | null;
  /** Slugs de sus libros, en orden de importancia. */
  libros: readonly string[];
  sellos: readonly ClaveSello[];
}

export const AUTORES: readonly Autor[] = [
  {
    slug: "g-g-alcedo",
    nombre: "G. G. Alcedo",
    rol: "Autor y fundador de Editorial Alcedo",
    bioCorta:
      "Escribe las guías prácticas que le habría gustado encontrar cuando le tocó resolverlo todo solo.",
    bioMedia:
      "Firma con sus iniciales y escribe sobre lo que ha tenido que resolver de verdad: facturas, hojas de cálculo, formularios de Hacienda y plantas que se le morían. Sus libros no terminan en una conclusión, terminan en una plantilla que ya funciona.",
    bioLarga: [
      "Alcedo es su apellido y es también el nombre científico del martín pescador, Alcedo atthis. De ahí sale la editorial y de ahí sale su manera de trabajar: mirar mucho antes de moverse, tirarse una sola vez y salir con el pez. Firma con las iniciales porque lo que tiene que lucir es el libro, no el autor.",
      "No escribe de lo que ha leído, sino de lo que ha tenido que sacar adelante sin que nadie se lo explicara: el primer trimestre de IVA con una carpeta de facturas encima de la mesa, la hoja de cálculo que se rompía cada vez que la tocaba, el presupuesto que había que enviar esa misma tarde. Cada plantilla que publica ha pasado antes por un caso real, con datos reales y con la normativa española delante. Si un capítulo no cambia nada en la semana del lector, lo quita.",
      "Hoy dirige los sellos Alcedo Práctico y Alcedo Vida, y escribe la mayor parte del catálogo. Sus guías se venden en Amazon en Kindle y tapa blanda, pero es aquí, en la web de la editorial, donde el libro viene acompañado de los ficheros editables con los que se trabaja de verdad.",
    ],
    foto: {
      src: "/autores/g-g-alcedo.svg",
      alt: "Retrato de G. G. Alcedo, autor y fundador de Editorial Alcedo",
      ancho: 800,
      alto: 800,
    },
    libros: [
      "excel-para-autonomos-en-espana",
      "ia-para-autonomos-y-pymes",
      "plantas-de-interior-que-no-se-mueren",
    ],
    sellos: ["practico", "vida"],
  },
] as const;

export const AUTOR_PRINCIPAL: Autor = AUTORES[0]!;

export function obtenerAutor(slug: string): Autor | undefined {
  return AUTORES.find((autor) => autor.slug === slug);
}
