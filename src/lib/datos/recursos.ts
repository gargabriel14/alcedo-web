import type { ClaveSello } from "@/lib/sellos";

/**
 * TODO(contenido) — Lead magnets. En la Fase 2 pasan a `/content/recursos/*.mdx`
 * y en la Fase 3 cada uno tendrá su landing con doble opt-in y su fichero en
 * Supabase Storage.
 *
 * El activo real del negocio es la lista de correo, así que un lead magnet no
 * es «apúntate al boletín»: es un entregable con nombre propio que resuelve
 * algo concreto y que el lector usaría aunque no comprase nunca un libro.
 */

export interface Recurso {
  slug: string;
  /** Nombre del entregable, tal cual se le promete al lector. */
  titulo: string;
  /** Una frase: qué hace por ti. Es el texto que va junto al formulario. */
  gancho: string;
  /** Formatos del fichero, para que se vea que es usable de verdad. */
  formatos: readonly string[];
  sello: ClaveSello;
  /** Libro al que empuja después de la descarga. */
  libroRelacionado: string;
  /** Micro-lista de lo que incluye. Máximo tres, que se lean de un vistazo. */
  incluye: readonly string[];
}

export const RECURSOS: readonly Recurso[] = [
  {
    slug: "plantilla-iva-trimestral-autonomos",
    titulo: "Plantilla de IVA trimestral para autónomos",
    gancho:
      "Apunta tus facturas emitidas y recibidas y la hoja te da la cifra de cada casilla del modelo 303. Sin fórmulas que tocar.",
    formatos: ["Excel", "Google Sheets"],
    sello: "practico",
    libroRelacionado: "excel-para-autonomos-en-espana",
    incluye: [
      "Hoja de facturas emitidas y recibidas con IVA por tipos",
      "Resumen automático con las casillas del 303",
      "Checklist de lo que revisar antes de presentar",
    ],
  },
  {
    slug: "calculadora-precio-hora",
    titulo: "Calculadora de precio/hora para autónomos",
    gancho:
      "Mete tus gastos fijos, la cuota y los días que de verdad facturas: te dice cuánto tienes que cobrar la hora para no trabajar gratis.",
    formatos: ["Excel", "Google Sheets"],
    sello: "practico",
    libroRelacionado: "excel-para-autonomos-en-espana",
    incluye: [
      "Cálculo con vacaciones, festivos y horas no facturables",
      "Comparador de tres escenarios de tarifa",
      "Guía de una página para subir precios sin perder clientes",
    ],
  },
  {
    slug: "mapa-de-luz-de-casa",
    titulo: "Mapa de luz de tu casa",
    gancho:
      "Una plantilla para medir la luz real de cada habitación con el móvil y saber qué planta aguanta en cada esquina antes de comprarla.",
    formatos: ["PDF imprimible"],
    sello: "vida",
    libroRelacionado: "plantas-de-interior-que-no-se-mueren",
    incluye: [
      "Método de medición en tres pasos, sin comprar aparatos",
      "Tabla de especies por nivel de luz",
      "Plano en blanco para rellenar",
    ],
  },
] as const;

/** El lead magnet que va sobre el pliegue en la home. */
export const RECURSO_PORTADA: Recurso = RECURSOS[0]!;

export function obtenerRecurso(slug: string): Recurso | undefined {
  return RECURSOS.find((recurso) => recurso.slug === slug);
}
