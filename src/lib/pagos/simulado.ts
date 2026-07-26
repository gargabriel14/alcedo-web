import "server-only";

import { obtenerProducto } from "@/lib/contenido/productos";
import {
  ErrorFirmaWebhook,
  type EventoVerificado,
  type Pedido,
  type ProveedorPago,
  type ResultadoCheckout,
} from "@/lib/pagos/tipos";

/**
 * Proveedor de pago simulado.
 *
 * Existe porque la cuenta de Paddle se pide **después** de publicar la web, y no
 * podemos tener la tienda a medio construir hasta que la aprueben. Con este
 * proveedor se recorre la compra entera —checkout, webhook, pedido, token de
 * descarga, correo, área de cliente— sin una sola credencial real.
 *
 * También es el que usan los tests de la Fase 4.
 *
 * Seguridad: la ruta del webhook solo acepta eventos simulados cuando el
 * proveedor activo es este. En producción con Paddle, un POST con la cabecera de
 * simulación se rechaza igual que cualquier otro con firma inválida.
 */
export class ProveedorSimulado implements ProveedorPago {
  readonly nombre = "simulado";
  readonly esSimulado = true;

  async crearCheckout(sku: string, email?: string): Promise<ResultadoCheckout> {
    const producto = obtenerProducto(sku);

    if (!producto || !producto.activo) {
      throw new Error(`El producto «${sku}» no existe o no está a la venta.`);
    }

    // Referencia con la misma forma que tendría una real, para que nada del
    // resto del sistema dependa del formato del identificador.
    const referencia = `sim_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

    const parametros = new URLSearchParams({ sku, ref: referencia });
    if (email) parametros.set("email", email);

    return { url: `/checkout/simulado?${parametros.toString()}`, referencia };
  }

  async verificarWebhook(peticion: Request): Promise<EventoVerificado> {
    if (peticion.headers.get("x-alcedo-simulado") !== "1") {
      throw new ErrorFirmaWebhook("falta la cabecera de simulación");
    }

    const cuerpo: unknown = await peticion.json();

    if (
      typeof cuerpo !== "object" ||
      cuerpo === null ||
      !("id" in cuerpo) ||
      !("tipo" in cuerpo)
    ) {
      throw new ErrorFirmaWebhook("el cuerpo simulado no tiene id ni tipo");
    }

    const { id, tipo } = cuerpo as { id: unknown; tipo: unknown };

    if (typeof id !== "string" || typeof tipo !== "string") {
      throw new ErrorFirmaWebhook("id y tipo tienen que ser texto");
    }

    return { id, tipo, datos: cuerpo };
  }

  async normalizarPedido(evento: EventoVerificado): Promise<Pedido | null> {
    if (evento.tipo !== "compra.completada") return null;

    const datos = evento.datos as {
      referencia?: unknown;
      email?: unknown;
      sku?: unknown;
    };

    if (
      typeof datos.referencia !== "string" ||
      typeof datos.email !== "string" ||
      typeof datos.sku !== "string"
    ) {
      throw new Error("Evento simulado incompleto: faltan referencia, email o sku.");
    }

    const producto = obtenerProducto(datos.sku);
    if (!producto) {
      throw new Error(`Evento simulado con un sku desconocido: «${datos.sku}».`);
    }

    // El importe sale del catálogo del servidor, nunca del evento: es la misma
    // regla que con la pasarela real.
    return {
      referenciaProveedor: datos.referencia,
      email: datos.email,
      sku: producto.sku,
      importeCentimos: Math.round(producto.precioEUR * 100),
      moneda: "EUR",
      pais: null,
      pagadoEn: new Date().toISOString(),
    };
  }
}
