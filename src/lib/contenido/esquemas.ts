import { z } from "zod";

/**
 * Esquemas del frontmatter. **Si un campo obligatorio falta, el build falla.**
 *
 * Es a propósito: publicar un libro sin precio, sin `sku` o sin FAQ es perder
 * dinero de forma silenciosa. Es mejor que reviente el despliegue y se arregle
 * en dos minutos. Los mensajes de error dicen el fichero y el campo exactos.
 *
 * La guía de estilo con un ejemplo completo de cada tipo está en CONTENIDO.md.
 */

const CLAVES_SELLO = ["practico", "vida", "labs"] as const;

/**
 * `2026-05-12`. Fechas en ISO y sin hora: el contenido no depende de la zona.
 *
 * YAML convierte solo las fechas sin comillas en objetos `Date`, así que las
 * normalizamos antes de validar. Nadie debería tener que acordarse de poner
 * comillas para que le funcione una ficha.
 */
const fechaIso = z.preprocess(
  (valor) => (valor instanceof Date ? valor.toISOString().slice(0, 10) : valor),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Usa el formato AAAA-MM-DD, por ejemplo 2026-05-12"),
);

const precioEuros = z
  .number()
  .positive("El precio tiene que ser mayor que cero")
  .max(500, "¿Seguro? Un precio de más de 500 € parece un error de tecleo");

/** Tipos de entregable. Cada uno tiene su icono en la ficha del libro. */
export const TIPOS_ENTREGABLE = [
  "excel",
  "sheets",
  "pdf",
  "plantilla",
  "checklist",
  "calendario",
] as const;

export type TipoEntregable = (typeof TIPOS_ENTREGABLE)[number];

const imagen = z.object({
  src: z.string().startsWith("/", "La ruta empieza por / y vive en public/"),
  alt: z.string().min(10, "El alt describe la imagen para quien no la ve"),
  ancho: z.number().int().positive(),
  alto: z.number().int().positive(),
});

// ---------------------------------------------------------------------------
// Libro
// ---------------------------------------------------------------------------

export const esquemaLibro = z.object({
  titulo: z.string().min(3),
  /** Título corto para Google, si el del libro pasa de 60 caracteres. */
  tituloSeo: z
    .string()
    .max(60, "Con más de 60 caracteres, Google lo corta: eso es lo que evita este campo")
    .optional(),
  subtitulo: z.string().min(10, "El subtítulo es media venta: concreta el resultado"),
  sello: z.enum(CLAVES_SELLO),
  /** Slug del autor en `/content/autores`. */
  autor: z.string().min(2),
  estado: z.enum(["publicado", "en-preparacion"]),
  fecha: fechaIso,
  paginas: z.number().int().positive(),
  /** Frase de venta que acompaña a la portada. */
  gancho: z.string().min(40, "El gancho necesita al menos una frase de verdad"),
  /** Qué vas a poder hacer al terminarlo. En verbos y en resultados. */
  resultados: z
    .array(z.string().min(15))
    .min(5, "Cinco resultados como mínimo: menos no convence")
    .max(7, "Más de siete y ya nadie los lee"),
  precios: z.object({
    pdf: precioEuros,
    kindle: precioEuros,
    tapaBlanda: precioEuros.optional(),
  }),
  /** La razón explícita por la que el PDF Premium gana al Kindle. */
  promesaPdf: z.string().min(20),
  /** Identificador del producto digital. Enlaza con la tienda en la Fase 3. */
  sku: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  entregables: z
    .array(
      z.object({
        titulo: z.string().min(5),
        tipo: z.enum(TIPOS_ENTREGABLE),
      }),
    )
    .min(1, "El PDF Premium se vende por sus entregables: pon al menos uno"),
  indice: z
    .array(
      z.object({
        titulo: z.string().min(3),
        pagina: z.number().int().positive().optional(),
        apartados: z.array(z.string()).default([]),
      }),
    )
    .min(3, "El índice completo es lo que más se mira antes de comprar"),
  /** Páginas de muestra reales. Vacío = se muestra el hueco pendiente. */
  muestras: z.array(imagen).default([]),
  faq: z
    .array(
      z.object({
        pregunta: z.string().min(10),
        respuesta: z.string().min(20),
      }),
    )
    .min(3, "Tres preguntas mínimo: son las objeciones que frenan la compra"),
  amazon: z
    .object({
      kindle: z.url().nullable().default(null),
      tapaBlanda: z.url().nullable().default(null),
    })
    .default({ kindle: null, tapaBlanda: null }),
  portada: imagen.nullable().default(null),
  /** Temas para el filtro del catálogo. En minúsculas. */
  temas: z.array(z.string().min(3)).min(1),
  /** Solo uno debería llevarlo: es el que sale en la portada de la web. */
  destacado: z.boolean().default(false),
});

export type FrontmatterLibro = z.infer<typeof esquemaLibro>;

// ---------------------------------------------------------------------------
// Autor
// ---------------------------------------------------------------------------

export const esquemaAutor = z.object({
  /** El nombre que se muestra. Si firmas con iniciales, aquí van las iniciales. */
  nombre: z.string().min(2),
  rol: z.string().min(5),
  bioCorta: z.string().min(30).max(180),
  bioMedia: z.string().min(80),
  foto: imagen.nullable().default(null),
  sellos: z.array(z.enum(CLAVES_SELLO)).default([]),
  /** Perfiles públicos, para el `sameAs` del JSON-LD. */
  enlaces: z.array(z.url()).default([]),
});

export type FrontmatterAutor = z.infer<typeof esquemaAutor>;

// ---------------------------------------------------------------------------
// Documento legal
// ---------------------------------------------------------------------------

export const esquemaLegal = z.object({
  titulo: z.string().min(5),
  /** Fecha de la última revisión. Se muestra al pie del documento. */
  actualizado: fechaIso,
  /** Resumen en una frase, para los metadatos. */
  resumen: z.string().min(30),
});

export type FrontmatterLegal = z.infer<typeof esquemaLegal>;

// ---------------------------------------------------------------------------
// Producto digital
// ---------------------------------------------------------------------------

/**
 * Un fichero descargable, con su versión.
 *
 * La versión no es decorativa: es lo que hace real la promesa de «actualización
 * gratuita 12 meses». La descarga sirve siempre la versión que hay aquí, y el
 * script de aviso compara con la que había para saber a quién escribir.
 */
export const esquemaFichero = z.object({
  nombre: z.string().min(5),
  /** Ruta dentro del bucket privado de Supabase Storage. */
  ruta: z.string().min(3),
  version: z.string().min(1),
  actualizado: fechaIso,
  /** Tamaño aproximado, para avisar antes de descargar en móvil. */
  megas: z.number().positive().optional(),
});

export const esquemaProducto = z.object({
  /** Identificador estable. Aparece en las URL de compra: no se cambia nunca. */
  sku: z.string().regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  titulo: z.string().min(5),
  descripcion: z.string().min(30),
  precioEUR: precioEuros,
  /**
   * Id del precio en la pasarela activa. Se queda a `null` mientras se trabaja
   * con el proveedor simulado; el checkout real lo exige.
   */
  idProveedorPago: z.string().nullable().default(null),
  tipo: z.enum(["libro", "bundle"]),
  /** Slug del libro, para productos de tipo `libro`. */
  libroRelacionado: z.string().nullable().default(null),
  /** SKUs incluidos, para productos de tipo `bundle`. */
  bundleDe: z.array(z.string()).default([]),
  ficheros: z.array(esquemaFichero).default([]),
  /** A `false` deja de venderse sin borrar el histórico de pedidos. */
  activo: z.boolean().default(true),
});

export type FrontmatterProducto = z.infer<typeof esquemaProducto>;
export type Fichero = z.infer<typeof esquemaFichero>;

// ---------------------------------------------------------------------------
// Artículo del blog
// ---------------------------------------------------------------------------

export const esquemaArticulo = z.object({
  titulo: z.string().min(10),
  /**
   * Título corto para la pestaña y para Google, cuando el titular del artículo
   * pasa de 60 caracteres y se cortaría en el resultado de búsqueda. El titular
   * de la página sigue siendo `titulo`: nadie tiene que escribir peor por caber.
   */
  tituloSeo: z
    .string()
    .max(60, "Con más de 60 caracteres, Google lo corta: eso es lo que evita este campo")
    .optional(),
  /** Meta description. Entre 110 y 160 caracteres es la horquilla útil. */
  descripcion: z.string().min(80).max(180),
  fecha: fechaIso,
  actualizado: fechaIso.optional(),
  autor: z.string().min(2),
  sello: z.enum(CLAVES_SELLO),
  temas: z.array(z.string().min(3)).min(1),
  /** Libro al que empuja el artículo. Slug de `/content/libros`. */
  libroRelacionado: z.string().min(3),
  /** Lead magnet del bloque de captura insertado a mitad del texto. */
  recursoRelacionado: z.string().min(3).optional(),
  imagen: imagen.nullable().default(null),
  borrador: z.boolean().default(false),
});

export type FrontmatterArticulo = z.infer<typeof esquemaArticulo>;
