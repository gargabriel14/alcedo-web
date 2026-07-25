import { SITIO, urlAbsoluta } from "@/lib/sitio";

/**
 * Datos estructurados JSON-LD.
 *
 * Se construyen en el servidor y se sirven dentro del HTML estático: Google los
 * lee sin ejecutar JavaScript.
 *
 * Regla: aquí no se declara nada que no sea verdad. En concreto, no hay
 * `aggregateRating` hasta que existan reseñas reales de lectores.
 */

type ObjetoJsonLd = Record<string, unknown>;

export const ID_ORGANIZACION = urlAbsoluta("/#organizacion");
export const ID_SITIO_WEB = urlAbsoluta("/#sitio");

export function organizacionJsonLd(): ObjetoJsonLd {
  return {
    "@type": "Organization",
    "@id": ID_ORGANIZACION,
    name: SITIO.nombre,
    alternateName: "Alcedo",
    url: SITIO.url,
    logo: urlAbsoluta("/logo.svg"),
    description: SITIO.descripcion,
    slogan: SITIO.claim,
    // TODO(contenido): añadir perfiles reales (TikTok, YouTube, Instagram) en
    // `sameAs` y el correo de contacto cuando existan.
    sameAs: [],
  };
}

export function sitioWebJsonLd(): ObjetoJsonLd {
  return {
    "@type": "WebSite",
    "@id": ID_SITIO_WEB,
    url: SITIO.url,
    name: SITIO.nombre,
    description: SITIO.descripcion,
    inLanguage: "es-ES",
    publisher: { "@id": ID_ORGANIZACION },
    // El buscador del catálogo se implementa en la Fase 2 sobre esta misma URL.
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: urlAbsoluta("/catalogo?buscar={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Envuelve varios nodos en un solo grafo, que es lo que prefiere Google. */
export function grafoJsonLd(...nodos: ObjetoJsonLd[]): ObjetoJsonLd {
  return { "@context": "https://schema.org", "@graph": nodos };
}
