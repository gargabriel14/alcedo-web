import type { Articulo } from "@/lib/contenido/blog";
import type { Autor } from "@/lib/contenido/autores";
import type { Libro } from "@/lib/contenido/libros";
import { DIAS_GARANTIA } from "@/lib/garantia";
import { obtenerSello } from "@/lib/sellos";
import { SITIO, urlAbsoluta } from "@/lib/sitio";

/** Fecha en ISO a un año vista, para la validez del precio. */
function dentroDeUnAno(): string {
  const fecha = new Date();
  fecha.setUTCFullYear(fecha.getUTCFullYear() + 1);
  return fecha.toISOString().slice(0, 10);
}

/**
 * Datos estructurados JSON-LD.
 *
 * Se construyen en el servidor y viajan dentro del HTML estático: Google los lee
 * sin ejecutar JavaScript.
 *
 * Regla que no se salta: aquí no se declara nada que no sea verdad. En concreto,
 * **no hay `aggregateRating`** hasta que existan reseñas reales de lectores.
 * Inventarlo es motivo de penalización manual y, en España, práctica desleal.
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
    // TODO(contenido): añadir perfiles reales (TikTok, YouTube, Instagram).
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
    /*
     * Sin `SearchAction` a propósito.
     *
     * Declaraba una caja de búsqueda apuntando a `/catalogo?buscar={q}`, pero el
     * catálogo filtra en el navegador y no lee ese parámetro: era una promesa que
     * el sitio no cumplía. Google prueba esas URL, y anunciar un buscador que no
     * busca es peor que no anunciar ninguno.
     *
     * Vuelve el día que exista una búsqueda de verdad en el catálogo.
     */
  };
}

// ---------------------------------------------------------------------------
// Libro
// ---------------------------------------------------------------------------

/** Imagen de la ficha: la portada real si existe, o la OG generada. */
function imagenDeLibro(libro: Libro): string {
  return libro.portada
    ? urlAbsoluta(libro.portada.src)
    : urlAbsoluta(`/libro/${libro.slug}/opengraph-image`);
}

export function libroJsonLd(libro: Libro): ObjetoJsonLd {
  const url = urlAbsoluta(`/libro/${libro.slug}`);

  return {
    "@type": "Book",
    "@id": `${url}#libro`,
    name: libro.titulo,
    alternativeHeadline: libro.subtitulo,
    url,
    image: imagenDeLibro(libro),
    description: libro.gancho,
    inLanguage: "es",
    numberOfPages: libro.paginas,
    datePublished: libro.fecha,
    bookFormat: "https://schema.org/EBook",
    author: {
      "@type": "Person",
      name: libro.autorNombre,
      url: urlAbsoluta(`/autor/${libro.autor}`),
    },
    publisher: { "@id": ID_ORGANIZACION },
    genre: obtenerSello(libro.sello).nombre,
    keywords: libro.temas.join(", "),
  };
}

/**
 * El producto que vendemos aquí: el PDF Premium con sus entregables.
 *
 * Solo se declara nuestra oferta. Las de Amazon no se incluyen porque el precio
 * lo fija Amazon y cambia sin avisar: declarar un precio que no se cumple es peor
 * que no declararlo.
 */
export function productoLibroJsonLd(libro: Libro): ObjetoJsonLd {
  const url = urlAbsoluta(`/libro/${libro.slug}`);

  return {
    "@type": "Product",
    "@id": `${url}#producto`,
    name: `${libro.titulo} — PDF Premium`,
    description: `${libro.gancho} El PDF Premium ${libro.promesaPdf}.`,
    url,
    image: imagenDeLibro(libro),
    brand: { "@id": ID_ORGANIZACION },
    category: obtenerSello(libro.sello).nombre,
    isRelatedTo: { "@id": `${url}#libro` },
    offers: {
      "@type": "Offer",
      price: libro.precios.pdf.toFixed(2),
      priceCurrency: "EUR",
      url: urlAbsoluta(`/comprar/${libro.sku}`),
      availability:
        libro.estado === "publicado"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ID_ORGANIZACION },
      /*
       * Un precio sin fecha de validez hace que Google avise en Search Console.
       * Un año vista: los precios de Alcedo no cambian por temporada, y si
       * cambian, el despliegue regenera esta fecha.
       */
      priceValidUntil: dentroDeUnAno(),
      // El impuesto lo gestiona la pasarela como vendedor: el precio es final.
      priceSpecification: {
        "@type": "PriceSpecification",
        price: libro.precios.pdf.toFixed(2),
        priceCurrency: "EUR",
        valueAddedTaxIncluded: true,
      },
      /*
       * La garantía de devolución, declarada.
       *
       * Google la muestra en los resultados de compra, y en un producto digital
       * de 29 € comprado a una editorial desconocida es exactamente la objeción
       * que frena el clic. Los días salen de `garantia.ts`, que es el mismo
       * módulo que decide si una devolución sigue en plazo: el dato estructurado
       * no puede prometer algo que el sistema no cumpla.
       */
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "ES",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: DIAS_GARANTIA,
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };
}

export function faqJsonLd(libro: Libro): ObjetoJsonLd {
  return {
    "@type": "FAQPage",
    "@id": urlAbsoluta(`/libro/${libro.slug}#faq`),
    mainEntity: libro.faq.map((entrada) => ({
      "@type": "Question",
      name: entrada.pregunta,
      acceptedAnswer: { "@type": "Answer", text: entrada.respuesta },
    })),
  };
}

// ---------------------------------------------------------------------------
// Autor y artículos
// ---------------------------------------------------------------------------

export function personaJsonLd(autor: Autor): ObjetoJsonLd {
  const url = urlAbsoluta(`/autor/${autor.slug}`);

  return {
    "@type": "Person",
    "@id": `${url}#persona`,
    name: autor.nombre,
    url,
    jobTitle: autor.rol,
    description: autor.bioMedia,
    ...(autor.foto ? { image: urlAbsoluta(autor.foto.src) } : {}),
    worksFor: { "@id": ID_ORGANIZACION },
    ...(autor.enlaces.length > 0 ? { sameAs: autor.enlaces } : {}),
  };
}

export function articuloJsonLd(articulo: Articulo, nombreAutor: string): ObjetoJsonLd {
  const url = urlAbsoluta(`/blog/${articulo.slug}`);

  return {
    "@type": "Article",
    "@id": `${url}#articulo`,
    headline: articulo.titulo,
    description: articulo.descripcion,
    url,
    mainEntityOfPage: url,
    image: articulo.imagen
      ? urlAbsoluta(articulo.imagen.src)
      : urlAbsoluta(`/blog/${articulo.slug}/opengraph-image`),
    datePublished: articulo.fecha,
    dateModified: articulo.actualizado ?? articulo.fecha,
    inLanguage: "es-ES",
    author: {
      "@type": "Person",
      name: nombreAutor,
      url: urlAbsoluta(`/autor/${articulo.autor}`),
    },
    publisher: { "@id": ID_ORGANIZACION },
    isAccessibleForFree: true,
    keywords: articulo.temas.join(", "),
  };
}

// ---------------------------------------------------------------------------
// Migas de pan
// ---------------------------------------------------------------------------

export interface Miga {
  nombre: string;
  ruta: string;
}

/** Ayuda a que Google muestre la jerarquía en el resultado, no solo la URL. */
export function migasJsonLd(migas: readonly Miga[]): ObjetoJsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: migas.map((miga, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      name: miga.nombre,
      item: urlAbsoluta(miga.ruta),
    })),
  };
}

/** Envuelve varios nodos en un solo grafo, que es lo que prefiere Google. */
export function grafoJsonLd(...nodos: ObjetoJsonLd[]): ObjetoJsonLd {
  return { "@context": "https://schema.org", "@graph": nodos };
}
