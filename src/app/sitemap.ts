import type { MetadataRoute } from "next";
import { todosLosAutores } from "@/lib/contenido/autores";
import { articulosPublicados } from "@/lib/contenido/blog";
import { todosLosLibros } from "@/lib/contenido/libros";
import { LISTA_SELLOS } from "@/lib/sellos";
import { RUTAS_ESTATICAS } from "@/lib/seo/rutas";
import { urlAbsoluta } from "@/lib/sitio";

/**
 * Sitemap generado del contenido real.
 *
 * `lastModified` sale de la fecha del propio contenido y no de la del build: si
 * el sitemap dijera «modificado hoy» en cada despliegue, Google dejaría de
 * hacerle caso.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const libros = todosLosLibros();
  const articulos = articulosPublicados();
  const ahora = new Date();

  const estaticas: MetadataRoute.Sitemap = RUTAS_ESTATICAS.map((entrada) => ({
    url: urlAbsoluta(entrada.ruta),
    lastModified: ahora,
    changeFrequency: entrada.frecuencia,
    priority: entrada.prioridad,
  }));

  const fichasDeLibro: MetadataRoute.Sitemap = libros.map((libro) => ({
    url: urlAbsoluta(`/libro/${libro.slug}`),
    lastModified: new Date(libro.fecha),
    changeFrequency: "monthly",
    // Las fichas son las páginas que venden: máxima prioridad tras la portada.
    priority: 0.9,
  }));

  const landingsDeSello: MetadataRoute.Sitemap = LISTA_SELLOS.map((sello) => ({
    url: urlAbsoluta(`/sellos/${sello.slug}`),
    lastModified: ahora,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const fichasDeAutor: MetadataRoute.Sitemap = todosLosAutores().map((autor) => ({
    url: urlAbsoluta(`/autor/${autor.slug}`),
    lastModified: ahora,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const entradasDeBlog: MetadataRoute.Sitemap = articulos.map((articulo) => ({
    url: urlAbsoluta(`/blog/${articulo.slug}`),
    lastModified: new Date(articulo.actualizado ?? articulo.fecha),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [
    ...estaticas,
    ...fichasDeLibro,
    ...landingsDeSello,
    ...entradasDeBlog,
    ...fichasDeAutor,
  ];
}
