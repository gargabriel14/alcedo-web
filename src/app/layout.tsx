import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import dynamic from "next/dynamic";
import { Cabecera } from "@/components/layout/Cabecera";
import { PieDePagina } from "@/components/layout/PieDePagina";
import { ScriptTema } from "@/components/layout/ScriptTema";
import { DatosEstructurados } from "@/components/seo/DatosEstructurados";
import { grafoJsonLd, organizacionJsonLd, sitioWebJsonLd } from "@/lib/seo/jsonLd";
import { SITIO } from "@/lib/sitio";
import "./globals.css";

/**
 * Fuentes autoalojadas: `next/font` las descarga en tiempo de build y las sirve
 * desde nuestro dominio. Cero peticiones a Google en runtime (requisito de
 * privacidad y de velocidad) y cero CLS gracias al ajuste automático de métricas.
 *
 * Fraunces se usa como fuente variable sin declarar los ejes SOFT/WONK: el
 * fichero pesa bastante menos y el carácter ya lo da el diseño de la letra.
 */
const fraunces = Fraunces({
  // Solo `latin`: cubre todo el español (á é í ó ú ü ñ ¿ ¡ « ») porque incluye el
  // suplemento Latin-1. `latin-ext` es para lenguas centroeuropeas y aquí solo
  // añadía peso: quitarlo de las dos fuentes ahorra ~80 kB en cada primera visita.
  subsets: ["latin"],
  // Un solo grosor en vez del fichero variable completo. Todos los titulares del
  // sitio usan 600, así que el resto del rango eran bytes que nadie pintaba.
  weight: ["600"],
  display: "swap",
  variable: "--fuente-titulares",
});

/**
 * Inter va con `optional` y no con `swap`, y es una decisión medida.
 *
 * Con `swap`, el navegador pinta el texto con la fuente del sistema y lo vuelve a
 * pintar cuando llega Inter. Ese segundo repintado cuenta como un LCP nuevo: en
 * la auditoría de móvil pasaba de 0,9 s a 3,6 s **sin que cambiara nada de lo que
 * ve el usuario**, y el LCP es el dato que Google usa para posicionar.
 *
 * Con `optional`, si la fuente no llega a tiempo se queda la del sistema en esa
 * primera pantalla y entra ya cacheada en la siguiente. Como `next/font` ajusta
 * las métricas del sustituto, no hay salto de maquetación: el visitante no nota
 * la diferencia, y el LCP se queda pegado al FCP.
 *
 * Fraunces se mantiene en `swap` porque los titulares sí llevan el carácter de la
 * marca y ahí sí compensa esperar.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "optional",
  variable: "--fuente-texto",
});

/**
 * El aviso de cookies se carga aparte: no pinta nada hasta que el navegador ya
 * ha resuelto si hace falta, así que no tiene por qué viajar en el mismo paquete
 * que lo que sí se ve al abrir la página.
 */
const AvisoCookies = dynamic(() =>
  import("@/components/layout/AvisoCookies").then((modulo) => modulo.AvisoCookies),
);

export const metadata: Metadata = {
  metadataBase: new URL(SITIO.url),
  title: {
    default: `${SITIO.nombre} — Guías prácticas con plantillas que se usan`,
    template: `%s · ${SITIO.nombre}`,
  },
  description: SITIO.descripcion,
  applicationName: SITIO.nombre,
  authors: [{ name: "G. G. Alcedo" }],
  publisher: SITIO.nombre,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITIO.localeOg,
    siteName: SITIO.nombre,
    url: "/",
    title: `${SITIO.nombre} — ${SITIO.claim}`,
    description: SITIO.descripcion,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITIO.nombre} — ${SITIO.claim}`,
    description: SITIO.descripcion,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#12110f" },
  ],
  colorScheme: "light dark",
};

export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  return (
    // `suppressHydrationWarning` porque el script del tema añade la clase
    // `oscuro` antes de que React hidrate: la diferencia es esperada.
    <html
      // Sale de la configuración, no escrito a mano: el día que exista `/en`,
      // el idioma del documento se resuelve con el resto de la configuración.
      lang={SITIO.idioma.split("-")[0]}
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <ScriptTema />
      </head>
      <body className="flex min-h-full flex-col">
        <a href="#contenido" className="salta-al-contenido rounded-md bg-marca px-4 py-2.5 text-sm font-medium text-marca-contraste shadow-lg">
          Saltar al contenido
        </a>

        <Cabecera />

        <main id="contenido" className="flex-1">
          {children}
        </main>

        <PieDePagina />

        <AvisoCookies />

        <DatosEstructurados
          datos={grafoJsonLd(organizacionJsonLd(), sitioWebJsonLd())}
        />

        {/* Analítica de Vercel: sin cookies y sin identificar al visitante, así
            que no requiere consentimiento previo. Los eventos de negocio
            (lead_captado, compra_completada…) van a nuestra propia tabla.

            Solo se monta en Vercel: su script vive en `/_vercel/insights` y solo
            existe allí. Cargarlo en local daba un 404 en consola que ensuciaba
            las auditorías y hacía perder puntos de «buenas prácticas». */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
