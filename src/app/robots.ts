import type { MetadataRoute } from "next";
import { urlAbsoluta } from "@/lib/sitio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Zonas privadas o sin valor para el buscador.
        disallow: ["/cuenta", "/checkout", "/api/", "/descargar/"],
      },
    ],
    sitemap: urlAbsoluta("/sitemap.xml"),
    host: urlAbsoluta("/"),
  };
}
