/**
 * Configuración única del sitio. Todo lo que dependa del dominio pasa por aquí,
 * para que comprar el dominio definitivo sea cambiar una variable de entorno.
 */

function resolverUrlSitio(): string {
  const explicita = process.env.NEXT_PUBLIC_URL_SITIO;
  if (explicita) return explicita.replace(/\/$/, "");

  // En Vercel esto existe desde el primer despliegue, así que la web tiene
  // canónicas y Open Graph correctos aún sin dominio propio configurado.
  const vercel = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const SITIO = {
  nombre: "Editorial Alcedo",
  claim: "Conocimiento con puntería",
  /** Una frase, la que va sobre el pliegue y en los metadatos. */
  propuesta:
    "Guías prácticas ilustradas que se leen en una tarde y se aplican al día siguiente.",
  descripcion:
    "Editorial independiente de no-ficción práctica ilustrada. Guías con plantillas listas para usar sobre Excel, IA, hogar, cocina y naturaleza. Sin relleno.",
  url: resolverUrlSitio(),
  idioma: "es-ES",
  localeOg: "es_ES",
  // TODO(contenido): sustituir por los buzones reales del dominio.
  emailContacto: "[[EMAIL DE CONTACTO]]",
  emailSoporte: "[[EMAIL DE SOPORTE]]",
} as const;

export const URL_SITIO = SITIO.url;

/** Enlace absoluto a partir de una ruta interna. */
export function urlAbsoluta(ruta: string): string {
  return new URL(ruta, `${URL_SITIO}/`).toString();
}

export interface EnlaceNavegacion {
  nombre: string;
  ruta: string;
  /** Texto de apoyo, se usa en el menú móvil. */
  pista?: string;
}

export const NAVEGACION_PRINCIPAL: readonly EnlaceNavegacion[] = [
  { nombre: "Catálogo", ruta: "/catalogo", pista: "Todos los libros por sello y tema" },
  { nombre: "Recursos gratis", ruta: "/recursos", pista: "Plantillas y guías descargables" },
  { nombre: "Blog", ruta: "/blog", pista: "Artículos prácticos, sin paja" },
  { nombre: "Sobre Alcedo", ruta: "/sobre-alcedo", pista: "Quién está detrás y por qué" },
] as const;

export const NAVEGACION_LEGAL: readonly EnlaceNavegacion[] = [
  { nombre: "Aviso legal", ruta: "/legal/aviso" },
  { nombre: "Privacidad", ruta: "/legal/privacidad" },
  { nombre: "Cookies", ruta: "/legal/cookies" },
  { nombre: "Términos de compra", ruta: "/legal/terminos" },
] as const;

export const NAVEGACION_EDITORIAL: readonly EnlaceNavegacion[] = [
  { nombre: "Autores", ruta: "/autores" },
  { nombre: "Contacto", ruta: "/contacto" },
  { nombre: "Publica con Alcedo", ruta: "/publica-con-alcedo" },
] as const;
