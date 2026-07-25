import type { ClaveSello } from "@/lib/sellos";

/**
 * TODO(contenido) — Datos de ejemplo de la Fase 1.
 *
 * En la Fase 2 estos objetos vendrán de `/content/libros/*.mdx` validados con
 * Zod, con esta misma forma, para que los componentes no cambien. Mientras
 * tanto viven aquí para poder maquetar la home con contenido plausible.
 *
 * Los tres libros son títulos de trabajo reales del plan editorial; los enlaces
 * a Amazon están vacíos porque todavía no hay nada publicado.
 */

export interface Portada {
  /** Ruta dentro de `/public`. Si es `null`, se dibuja la portada tipográfica. */
  src: string | null;
  alt: string;
  ancho: number;
  alto: number;
}

export interface Libro {
  slug: string;
  titulo: string;
  subtitulo: string;
  sello: ClaveSello;
  autor: string;
  autorSlug: string;
  estado: "publicado" | "en-preparacion";
  /** Fecha de publicación en ISO. Para «en preparación», la prevista. */
  fecha: string;
  paginas: number;
  /** Frase de venta, la que acompaña a la portada. */
  gancho: string;
  /** Qué vas a poder hacer al terminarlo. En verbos, resultados concretos. */
  resultados: readonly string[];
  precioPdfEUR: number;
  precioKindleEUR: number;
  precioTapaBlandaEUR: number;
  /**
   * La razón explícita por la que el PDF Premium es la mejor opción. Se usa en
   * la home y, en la Fase 2, en la tarjeta destacada del selector de formato.
   * Tiene que decir qué se llevan aquí que en Amazon no.
   */
  promesaPdf: string;
  entregables: readonly string[];
  portada: Portada;
  enlacesAmazon: {
    kindle: string | null;
    tapaBlanda: string | null;
  };
}

export const LIBROS: readonly Libro[] = [
  {
    slug: "excel-para-autonomos-en-espana",
    titulo: "Excel para autónomos en España",
    subtitulo: "De la factura al modelo 303 sin salir de una hoja de cálculo",
    sello: "practico",
    autor: "G. G. Alcedo",
    autorSlug: "g-g-alcedo",
    estado: "publicado",
    fecha: "2026-05-12",
    paginas: 184,
    gancho:
      "El libro que te quita la carpeta de facturas de encima. Trece plantillas encadenadas que van de la factura emitida al trimestre presentado, explicadas celda a celda.",
    resultados: [
      "Emitir facturas numeradas y con IVA correcto desde una plantilla que se rellena sola",
      "Llevar el libro de ingresos y gastos que exige Hacienda sin duplicar ningún apunte",
      "Sacar la cifra de cada casilla del modelo 303 en menos de diez minutos",
      "Separar gasto deducible de no deducible con una regla clara, no con intuición",
      "Detectar en un gráfico qué meses te dejan sin caja antes de que ocurra",
      "Calcular tu precio/hora real, con cuota de autónomos y días no facturables incluidos",
      "Cerrar el año con el resumen anual cuadrado y listo para tu asesor",
    ],
    precioPdfEUR: 29,
    precioKindleEUR: 5.99,
    precioTapaBlandaEUR: 18.9,
    promesaPdf: "incluye las 13 plantillas de Excel editables; el Kindle, no",
    entregables: [
      "13 plantillas de Excel editables, también en Google Sheets",
      "Calculadora de precio/hora para autónomos",
      "Checklist trimestral del 303 en PDF imprimible",
      "Cuadro de cuentas para el libro de ingresos y gastos",
    ],
    portada: {
      src: null,
      alt: "Portada de Excel para autónomos en España, de G. G. Alcedo",
      ancho: 1200,
      alto: 1800,
    },
    enlacesAmazon: { kindle: null, tapaBlanda: null },
  },
  {
    slug: "ia-para-autonomos-y-pymes",
    titulo: "IA para autónomos y pymes",
    subtitulo: "Automatiza presupuestos, correos y redes en una tarde",
    sello: "practico",
    autor: "G. G. Alcedo",
    autorSlug: "g-g-alcedo",
    estado: "en-preparacion",
    fecha: "2026-10-01",
    paginas: 168,
    gancho:
      "Veinte tareas que hoy te comen la mañana y mañana no. Sin hablar de futuro ni de robots: instrucciones que copias, pegas y ajustas a tu negocio.",
    resultados: [
      "Redactar un presupuesto completo a partir de cuatro datos y un correo del cliente",
      "Montar un sistema de respuestas para las diez preguntas que te repiten siempre",
      "Convertir una llamada grabada en un acta con tareas y fechas",
      "Sacar un mes de contenido para redes a partir de un solo trabajo terminado",
      "Revisar un contrato y saber qué preguntarle a tu abogado antes de pagarle una hora",
      "Saber qué datos de tu negocio no debes pegar nunca en una herramienta de IA",
    ],
    precioPdfEUR: 24,
    precioKindleEUR: 5.99,
    precioTapaBlandaEUR: 17.9,
    promesaPdf:
      "incluye las 40 instrucciones listas para copiar y la plantilla de presupuesto",
    entregables: [
      "40 instrucciones probadas, listas para copiar",
      "Plantilla de presupuesto automatizada",
      "Hoja de control de datos sensibles",
    ],
    portada: {
      src: null,
      alt: "Portada de IA para autónomos y pymes, de G. G. Alcedo",
      ancho: 1200,
      alto: 1800,
    },
    enlacesAmazon: { kindle: null, tapaBlanda: null },
  },
  {
    slug: "plantas-de-interior-que-no-se-mueren",
    titulo: "Plantas de interior que no se mueren",
    subtitulo: "Luz, riego y sustrato explicados por fin de forma clara",
    sello: "vida",
    autor: "G. G. Alcedo",
    autorSlug: "g-g-alcedo",
    estado: "en-preparacion",
    fecha: "2026-11-15",
    paginas: 152,
    gancho:
      "Veinticuatro especies que aguantan un piso español de verdad, con su ficha ilustrada, su calendario de riego y el error que las mata.",
    resultados: [
      "Medir la luz real de cada habitación sin comprar ningún aparato",
      "Regar por peso de la maceta y no por calendario, que es lo que las ahogaba",
      "Preparar tres mezclas de sustrato con lo que venden en cualquier ferretería",
      "Identificar de un vistazo si una hoja amarilla es exceso de agua, falta o plaga",
      "Trasplantar sin romper el cepellón y sin dejar la casa perdida",
      "Elegir qué planta va a cada esquina de tu casa antes de gastar el dinero",
    ],
    precioPdfEUR: 22,
    precioKindleEUR: 4.99,
    precioTapaBlandaEUR: 19.9,
    promesaPdf:
      "incluye las 24 fichas ilustradas imprimibles y el calendario de riego",
    entregables: [
      "24 fichas de especie ilustradas en PDF imprimible",
      "Calendario de riego y abonado por estación",
      "Mapa de luz de la casa para rellenar",
    ],
    portada: {
      src: null,
      alt: "Portada de Plantas de interior que no se mueren, de G. G. Alcedo",
      ancho: 1200,
      alto: 1800,
    },
    enlacesAmazon: { kindle: null, tapaBlanda: null },
  },
] as const;

/** El libro que va sobre el pliegue en la home. */
export const LIBRO_DESTACADO: Libro = LIBROS[0]!;

export function obtenerLibro(slug: string): Libro | undefined {
  return LIBROS.find((libro) => libro.slug === slug);
}
