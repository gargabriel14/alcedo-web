"use server";

import { redirect } from "next/navigation";
import { obtenerProducto } from "@/lib/contenido/productos";
import { proveedorDePago } from "@/lib/pagos/proveedor";
import { registrarEvento } from "@/lib/tienda/almacen";
import { urlAbsoluta } from "@/lib/sitio";

/**
 * Acciones de la tienda.
 *
 * Aquí no se recibe nunca un precio del cliente: llega un SKU, y el importe sale
 * del catálogo del servidor. Es la regla que impide que alguien manipule el
 * formulario y se lleve un libro de 29 € por un euro.
 */

export type EstadoCompra = { estado: "inicial" } | { estado: "error"; mensaje: string };

export const ESTADO_COMPRA_INICIAL: EstadoCompra = { estado: "inicial" };

export async function iniciarCompra(
  _estadoPrevio: EstadoCompra,
  datos: FormData,
): Promise<EstadoCompra> {
  const sku = datos.get("sku");

  if (typeof sku !== "string" || !sku) {
    return { estado: "error", mensaje: "Falta el producto." };
  }

  const producto = obtenerProducto(sku);

  if (!producto || !producto.activo) {
    return { estado: "error", mensaje: "Ese producto no está a la venta ahora mismo." };
  }

  let destino: string;

  try {
    const proveedor = proveedorDePago();
    const checkout = await proveedor.crearCheckout(producto.sku);

    await registrarEvento("checkout_iniciado", {
      sku: producto.sku,
      importe_centimos: Math.round(producto.precioEUR * 100),
      proveedor: proveedor.nombre,
    });

    destino = checkout.url;
  } catch (error) {
    console.error("[tienda] no se ha podido abrir el pago:", error);
    return {
      estado: "error",
      mensaje:
        "No hemos podido abrir la pasarela de pago. Inténtalo otra vez en un momento.",
    };
  }

  // Fuera del try: `redirect` funciona lanzando una excepción de control.
  redirect(destino);
}

/**
 * Simula el aviso de pago de la pasarela.
 *
 * Llama a nuestro propio webhook con la cabecera de simulación, así que recorre
 * exactamente el mismo camino que un pago real: verificación, idempotencia,
 * creación del pedido, token de descarga y correo. Sin esto, el proveedor
 * simulado probaría un camino distinto del de producción y no serviría de nada.
 */
export async function completarPagoSimulado(
  _estadoPrevio: EstadoCompra,
  datos: FormData,
): Promise<EstadoCompra> {
  const sku = datos.get("sku");
  const email = datos.get("email");
  const referencia = datos.get("referencia");

  if (typeof sku !== "string" || typeof email !== "string" || typeof referencia !== "string") {
    return { estado: "error", mensaje: "Faltan datos del pago simulado." };
  }

  if (!email.includes("@")) {
    return { estado: "error", mensaje: "Escribe un correo válido para la prueba." };
  }

  const respuesta = await fetch(urlAbsoluta("/api/pagos/webhook"), {
    method: "POST",
    headers: { "content-type": "application/json", "x-alcedo-simulado": "1" },
    body: JSON.stringify({
      id: `evt_sim_${referencia}`,
      tipo: "compra.completada",
      referencia,
      email: email.trim().toLowerCase(),
      sku,
    }),
  });

  if (!respuesta.ok) {
    return {
      estado: "error",
      mensaje: `El webhook simulado ha respondido ${respuesta.status}. Mira la consola del servidor.`,
    };
  }

  redirect(`/checkout/exito?ref=${encodeURIComponent(referencia)}`);
}
