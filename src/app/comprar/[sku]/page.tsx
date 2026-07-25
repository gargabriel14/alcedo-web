import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnlaceBoton } from "@/components/ui/Boton";
import { Contenedor } from "@/components/ui/Contenedor";
import { todosLosLibros } from "@/lib/contenido/libros";
import { DIAS_GARANTIA, MESES_ACTUALIZACION } from "@/lib/garantia";
import { formatearPrecio } from "@/lib/utils";

/**
 * Inicio de compra.
 *
 * Esta URL es la definitiva a propósito: en la Fase 3, esta misma ruta llamará a
 * `crearCheckout(sku, email)` de la capa de pago y redirigirá al checkout alojado.
 * Así los botones de compra de todo el sitio no cambian cuando llegue la pasarela,
 * y los enlaces que ya estén compartidos seguirán funcionando.
 */
export function generateStaticParams() {
  return todosLosLibros().map((libro) => ({ sku: libro.sku }));
}

export const metadata: Metadata = {
  title: "Comprar",
  robots: { index: false, follow: false },
};

export default async function PaginaComprar({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const libro = todosLosLibros().find((candidato) => candidato.sku === sku);

  if (!libro) notFound();

  return (
    <Contenedor ancho="lectura" className="py-16 sm:py-24">
      <p className="ojo-titular">Tienda · Fase 3</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">
        Todavía no se puede pagar aquí
      </h1>

      <div className="mt-8 rounded-lg border border-borde bg-superficie p-5 sm:p-6">
        <p className="ojo-titular">Lo que ibas a comprar</p>
        <h2 className="mt-2 text-xl">{libro.titulo} — PDF Premium</h2>
        <p className="mt-2 text-sm leading-relaxed text-texto-tenue">
          {libro.promesaPdf.charAt(0).toUpperCase() + libro.promesaPdf.slice(1)}.
        </p>
        <p className="mt-4 font-titulares text-3xl font-semibold text-texto">
          {formatearPrecio(libro.precios.pdf)}
        </p>
        <p className="mt-1 text-xs text-texto-tenue">
          Impuestos incluidos · Actualizaciones {MESES_ACTUALIZACION} meses ·
          Garantía de {DIAS_GARANTIA} días
        </p>
      </div>

      <p className="mt-8 leading-relaxed text-texto-tenue">
        La pasarela de pago se conecta en la Fase 3 del plan. Hasta entonces, este
        botón existe para que el recorrido de compra esté montado y probado de
        principio a fin: cuando la cuenta esté aprobada, esta misma dirección llevará
        al pago sin cambiar un solo enlace del sitio.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <EnlaceBoton href={`/libro/${libro.slug}`}>
          Volver a la ficha del libro
        </EnlaceBoton>
        <EnlaceBoton href="/recursos" variante="secundario">
          Ver recursos gratuitos
        </EnlaceBoton>
      </div>

      <p className="mt-8 text-sm text-texto-tenue">
        Mientras tanto, puedes{" "}
        <Link href="/" className="underline hover:text-marca-texto">
          apuntarte a la lista
        </Link>{" "}
        y te avisamos el día que abra la tienda.
      </p>
    </Contenedor>
  );
}
