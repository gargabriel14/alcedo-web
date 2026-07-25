import type { NextConfig } from "next";

/**
 * Cabeceras de seguridad. No hay CSP estricta todavía: el script en línea que
 * decide el tema antes del primer paint necesitaría un `nonce`, y generar un
 * nonce fuerza render dinámico en todas las páginas, lo que se llevaría por
 * delante el SSG. Se revisa en la Fase 4 con `next.config` + middleware solo
 * en las rutas que lo requieran.
 */
const cabecerasSeguridad = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
] as const;

const nextConfig: NextConfig = {
  // No anunciamos la tecnología del servidor.
  poweredByHeader: false,

  // Sin barra final: URLs limpias y canónicas sin ambigüedad.
  trailingSlash: false,

  images: {
    // AVIF primero: entre un 20 % y un 30 % menos de bytes que WebP en portadas.
    formats: ["image/avif", "image/webp"],
    // Anchos ajustados a las cajas reales del diseño (portadas y tarjetas),
    // para no generar variantes que nadie pide.
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536],
    imageSizes: [96, 128, 192, 256, 384],
  },

  async headers() {
    return [{ source: "/:ruta*", headers: [...cabecerasSeguridad] }];
  },

  /**
   * Redirecciones 301. Aquí se irán añadiendo las de URLs que cambien de sitio,
   * para no perder posicionamiento ni enlaces impresos en los libros.
   */
  async redirects() {
    return [];
  },
};

export default nextConfig;
