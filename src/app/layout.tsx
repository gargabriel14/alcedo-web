import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--fuente-titulares",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--fuente-texto",
});

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
      lang="es"
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

        <DatosEstructurados
          datos={grafoJsonLd(organizacionJsonLd(), sitioWebJsonLd())}
        />

        {/* Analítica de Vercel: sin cookies y sin identificar al visitante, así
            que no requiere consentimiento previo. Los eventos de negocio
            (lead_captado, compra_completada…) irán a nuestra propia tabla. */}
        <Analytics />
      </body>
    </html>
  );
}
