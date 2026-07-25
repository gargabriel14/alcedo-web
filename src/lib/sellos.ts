/**
 * Los sellos de la editorial. Cada uno tiene su color y su promesa.
 *
 * Las clases de Tailwind están escritas como literales a propósito: el
 * compilador escanea el código fuente y no encontraría `bg-sello-${clave}`.
 */

export type ClaveSello = "practico" | "vida" | "labs";

export interface Sello {
  clave: ClaveSello;
  nombre: string;
  slug: string;
  /** Media frase para badges y cabeceras. */
  lema: string;
  /** Párrafo para la tarjeta de la home y la landing del sello. */
  descripcion: string;
  /**
   * Color de marca fijo, sin adaptación al tema. Solo para objetos que en el
   * mundo real no cambian de color: portadas, imágenes OG, favicon.
   */
  hex: string;
  clases: {
    /** Fondo suave + texto oscuro del sello. Contraste AA verificado. */
    badge: string;
    /** Color pleno, para puntos, barras y filetes. */
    solido: string;
    /** Texto sobre el fondo del tema activo. */
    texto: string;
    borde: string;
    /** Fondo tenue para bandas y tarjetas. */
    suave: string;
  };
}

export const SELLOS: Record<ClaveSello, Sello> = {
  practico: {
    clave: "practico",
    nombre: "Alcedo Práctico",
    slug: "practico",
    lema: "Herramientas digitales aplicadas a un oficio",
    descripcion:
      "Excel, inteligencia artificial y ofimática explicadas para quien tiene que facturar mañana. Cada libro sale de un problema real de un autónomo o una pyme, y termina en una plantilla que ya funciona.",
    hex: "#0E7C9B",
    clases: {
      badge: "bg-sello-practico-suave text-sello-practico-texto",
      solido: "bg-sello-practico",
      texto: "text-sello-practico-texto",
      borde: "border-sello-practico",
      suave: "bg-sello-practico-suave",
    },
  },
  vida: {
    clave: "vida",
    nombre: "Alcedo Vida",
    slug: "vida",
    lema: "Hogar, cocina, plantas y naturaleza",
    descripcion:
      "Lo que antes se aprendía mirando a alguien hacerlo, ahora ilustrado paso a paso. No-ficción práctica para la casa, la mesa y el balcón, con la precisión de un manual y el gusto de un libro que se queda a la vista.",
    hex: "#2E7D4F",
    clases: {
      badge: "bg-sello-vida-suave text-sello-vida-texto",
      solido: "bg-sello-vida",
      texto: "text-sello-vida-texto",
      borde: "border-sello-vida",
      suave: "bg-sello-vida-suave",
    },
  },
  labs: {
    clave: "labs",
    nombre: "Alcedo Labs",
    slug: "labs",
    lema: "Experimentos editoriales",
    descripcion:
      "Formatos raros, tiradas cortas e ideas que todavía no sabemos si funcionan. Aquí probamos en público: si un experimento de Labs encuentra a sus lectores, se convierte en colección.",
    hex: "#C4642A",
    clases: {
      badge: "bg-sello-labs-suave text-sello-labs-texto",
      solido: "bg-sello-labs",
      texto: "text-sello-labs-texto",
      borde: "border-sello-labs",
      suave: "bg-sello-labs-suave",
    },
  },
};

export const LISTA_SELLOS: readonly Sello[] = [
  SELLOS.practico,
  SELLOS.vida,
  SELLOS.labs,
] as const;

export function obtenerSello(clave: ClaveSello): Sello {
  return SELLOS[clave];
}
