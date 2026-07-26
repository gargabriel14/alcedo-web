import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FormularioPagoSimulado } from "@/components/tienda/FormularioPagoSimulado";
import { Contenedor } from "@/components/ui/Contenedor";
import { ficherosDelProducto, obtenerProducto } from "@/lib/contenido/productos";
import { proveedorDePago } from "@/lib/pagos/proveedor";
import { formatearPrecio } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pago simulado",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Checkout simulado.
 *
 * Ocupa el sitio del checkout alojado de Paddle mientras no hay cuenta. Está
 * pintado con una franja de aviso muy visible a propósito: si algún día esto
 * llegara a producción por error, nadie podría confundirlo con un pago real.
 *
 * Solo existe cuando el proveedor activo es el simulado. Con Paddle configurado,
 * esta ruta devuelve 404.
 */
export default async function PaginaCheckoutSimulado({
  searchParams,
}: {
  searchParams: Promise<{ sku?: string; ref?: string; email?: string }>;
}) {
  const proveedor = proveedorDePago();
  if (!proveedor.esSimulado) notFound();

  const { sku, ref, email } = await searchParams;
  const producto = sku ? obtenerProducto(sku) : undefined;

  if (!producto || !ref) notFound();

  const ficheros = ficherosDelProducto(producto);

  return (
    <Contenedor ancho="lectura" className="py-14 sm:py-20">
      <div className="rounded-lg border-2 border-dashed border-sello-labs bg-sello-labs-suave p-4">
        <p className="text-sm leading-relaxed font-semibold text-sello-labs-texto">
          Pago simulado. Aquí no se cobra dinero ni se pide ninguna tarjeta.
        </p>
        <p className="mt-1 text-sm leading-relaxed text-texto-tenue">
          Sirve para probar la compra entera —pedido, descarga, correo y área de
          cliente— mientras la cuenta de la pasarela real está en revisión.
        </p>
      </div>

      <h1 className="mt-8 text-3xl sm:text-4xl">Confirmar la compra</h1>

      <div className="mt-6 rounded-lg border border-borde bg-superficie p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-xl">{producto.titulo}</h2>
          <p className="font-titulares text-2xl font-semibold text-texto">
            {formatearPrecio(producto.precioEUR)}
          </p>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-texto-tenue">
          {producto.descripcion}
        </p>

        <ul className="mt-4 flex flex-col gap-1.5 border-t border-borde pt-4 text-sm text-texto-tenue">
          {ficheros.map((fichero) => (
            <li key={fichero.ruta}>{fichero.nombre}</li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-texto-tenue">
          Impuestos incluidos. En producción, esta pantalla la sirve la pasarela, que
          actúa como vendedor y emite la factura.
        </p>
      </div>

      <FormularioPagoSimulado sku={producto.sku} referencia={ref} emailInicial={email} />

      <p className="mt-6 text-xs text-texto-tenue">
        Referencia de la transacción: <code>{ref}</code>
      </p>
    </Contenedor>
  );
}
