import type { Metadata, Viewport } from "next";
import { Archivo, Fraunces } from "next/font/google";
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
 * Archivo para el texto, no Inter.
 *
 * Inter está diseñada para interfaces y en un sitio editorial se lee como
 * «aplicación». Archivo viene del rótulo y la prensa: tiene el asta más recta y
 * las versalitas con más carácter, que es lo que hace que un antetítulo en
 * mayúsculas no parezca un botón. Sigue siendo una grotesca muy legible y sigue
 * viniendo autoalojada por `next/font`.
 *
 * Las dos con `display: swap`: se probó `optional` para ver si el repintado al
 * llegar la fuente empujaba el LCP, y la medición dijo que no cambiaba nada.
 */
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
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
      className={`${fraunces.variable} ${archivo.variable} h-full antialiased`}
    >
      <head>
        {/*
          Le dice a Dark Reader que no toque nada: el sitio ya trae su propio modo
          oscuro, con los contrastes calculados uno a uno. La extensión invertía
          por segunda vez lo que ya estaba invertido y, de paso, metía atributos en
          el HTML antes de que React hidratara, lo que provocaba avisos de
          discrepancia en desarrollo.
        */}
        <meta name="darkreader-lock" />
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
