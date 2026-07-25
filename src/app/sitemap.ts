import type { MetadataRoute } from "next";
import { RUTAS_INDEXABLES } from "@/lib/seo/rutas";
import { urlAbsoluta } from "@/lib/sitio";

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();

  return RUTAS_INDEXABLES.map((entrada) => ({
    url: urlAbsoluta(entrada.ruta),
    lastModified: ahora,
    changeFrequency: entrada.frecuencia,
    priority: entrada.prioridad,
  }));
}
