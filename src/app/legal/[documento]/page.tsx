import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnPreparacion } from "@/components/layout/EnPreparacion";

/**
 * Documentos legales.
 *
 * De momento son páginas puente. Las plantillas reales (con los marcadores
 * `[[RAZÓN SOCIAL]]`, `[[NIF]]` y `[[DIRECCIÓN]]`) se escriben en la Fase 3,
 * antes de solicitar la cuenta de Paddle: la pasarela revisa que existan el
 * aviso legal, la privacidad y la política de reembolso antes de aprobar.
 */
const DOCUMENTOS = {
  aviso: {
    titulo: "Aviso legal",
    descripcion:
      "Identificación del titular del sitio, condiciones de uso y propiedad intelectual de los contenidos.",
  },
  privacidad: {
    titulo: "Política de privacidad",
    descripcion:
      "Qué datos recogemos, para qué, cuánto tiempo los guardamos y cómo ejercer tus derechos. Incluirá el detalle de la lista de correo y de los datos que trata la pasarela de pago.",
  },
  cookies: {
    titulo: "Política de cookies",
    descripcion:
      "Qué cookies usa el sitio y cuáles necesitan tu consentimiento. Ahora mismo la web no instala ninguna cookie que no sea imprescindible.",
  },
  terminos: {
    titulo: "Términos de compra",
    descripcion:
      "Condiciones de venta de los productos digitales, entrega, actualizaciones y política de reembolso de 14 días.",
  },
} as const;

type ClaveDocumento = keyof typeof DOCUMENTOS;

export function generateStaticParams() {
  return Object.keys(DOCUMENTOS).map((documento) => ({ documento }));
}

function esClaveDocumento(valor: string): valor is ClaveDocumento {
  return valor in DOCUMENTOS;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ documento: string }>;
}): Promise<Metadata> {
  const { documento } = await params;

  return {
    title: esClaveDocumento(documento) ? DOCUMENTOS[documento].titulo : "Legal",
    robots: { index: false, follow: true },
  };
}

export default async function PaginaLegal({
  params,
}: {
  params: Promise<{ documento: string }>;
}) {
  const { documento } = await params;

  if (!esClaveDocumento(documento)) notFound();

  const datos = DOCUMENTOS[documento];

  return (
    <EnPreparacion fase="Fase 3" titulo={datos.titulo} descripcion={datos.descripcion} />
  );
}
