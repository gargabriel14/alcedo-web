import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BotonComprar } from "@/components/tienda/BotonComprar";
import { Contenedor } from "@/components/ui/Contenedor";
import { obtenerLibro } from "@/lib/contenido/libros";
import {
  ficherosDelProducto,
  obtenerProducto,
  todosLosProductos,
} from "@/lib/contenido/productos";
import { DIAS_GARANTIA, MESES_ACTUALIZACION } from "@/lib/garantia";
import { proveedorDePago } from "@/lib/pagos/proveedor";
import { formatearPrecio } from "@/lib/utils";

export function generateStaticParams() {
  return todosLosProductos().map((producto) => ({ sku: producto.sku }));
}

export const metadata: Metadata = {
  title: "Confirmar compra",
  robots: { index: false, follow: false },
};

/**
 * Última pantalla antes de pagar.
 *
 * Repite qué se lleva y las dos garantías, que es donde se cae la mitad de las
 * compras de un producto digital de un desconocido. De aquí se sale a la
 * pasarela: el precio lo pone el servidor a partir del SKU.
 */
export default async function PaginaComprar({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const producto = obtenerProducto(sku);

  if (!producto || !producto.activo) notFound();

  const ficheros = ficherosDelProducto(producto);
  const libro = producto.libroRelacionado
    ? obtenerLibro(producto.libroRelacionado)
    : undefined;
  const proveedor = proveedorDePago();

  return (
    <Contenedor ancho="lectura" className="py-14 sm:py-20">
      <p className="ojo-titular">Tu compra</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">{producto.titulo}</h1>
      <p className="mt-4 text-lg leading-relaxed text-texto-tenue">
        {producto.descripcion}
      </p>

      <div className="mt-8 rounded-lg border border-borde bg-superficie p-5 sm:p-6">
        <p className="ojo-titular">Incluye</p>
        <ul className="mt-3 flex flex-col gap-2 text-[0.9375rem] text-texto-tenue">
          {ficheros.map((fichero) => (
            <li key={fichero.ruta} className="flex gap-2.5">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1 size-4 shrink-0 text-marca"
              >
                <path d="m4 10.5 4 4 8-9" />
              </svg>
              {fichero.nombre}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3 border-t border-borde pt-5">
          <span className="text-sm text-texto-tenue">Total, impuestos incluidos</span>
          <span className="font-titulares text-3xl font-semibold text-texto">
            {formatearPrecio(producto.precioEUR)}
          </span>
        </div>

        <div className="mt-5">
          <BotonComprar sku={producto.sku}>
            Pagar {formatearPrecio(producto.precioEUR)}
          </BotonComprar>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-texto-tenue">
          Descarga inmediata al pagar · Actualizaciones {MESES_ACTUALIZACION} meses ·{" "}
          <Link href="/legal/terminos#reembolsos" className="underline hover:text-marca-texto">
            Garantía de devolución de {DIAS_GARANTIA} días
          </Link>
        </p>
      </div>

      {proveedor.esSimulado ? (
        <p className="mt-6 rounded-lg border border-dashed border-sello-labs bg-sello-labs-suave p-4 text-sm leading-relaxed text-texto-tenue">
          <strong className="font-semibold text-sello-labs-texto">
            Pasarela en modo simulado.
          </strong>{" "}
          El botón lleva a un pago de prueba que no cobra nada, para poder recorrer
          todo el proceso mientras la cuenta real está en revisión.
        </p>
      ) : null}

      {libro ? (
        <p className="mt-8 text-sm text-texto-tenue">
          ¿Quieres repasar antes qué trae?{" "}
          <Link href={`/libro/${libro.slug}`} className="underline hover:text-marca-texto">
            Vuelve a la ficha de {libro.titulo}
          </Link>
          .
        </p>
      ) : null}
    </Contenedor>
  );
}
