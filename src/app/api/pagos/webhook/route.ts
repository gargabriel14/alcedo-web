import { ficherosDelProducto, obtenerProducto } from "@/lib/contenido/productos";
import { enviarCorreo } from "@/lib/correo/enviar";
import { correoCompra } from "@/lib/correo/plantillas";
import { DIAS_GARANTIA, MESES_ACTUALIZACION } from "@/lib/garantia";
import { ErrorFirmaWebhook, proveedorDePago } from "@/lib/pagos/proveedor";
import { urlAbsoluta } from "@/lib/sitio";
import {
  cerrarEventoWebhook,
  crearPedido,
  eventoWebhookEsNuevo,
  olvidarEventoWebhook,
  pedidoPorReferencia,
  registrarEvento,
} from "@/lib/tienda/almacen";

/**
 * Webhook de la pasarela de pago.
 *
 * Es el punto más delicado de la tienda: aquí se decide que alguien ha pagado.
 * El orden importa y es este:
 *
 *   1. **Verificar la firma.** Sin esto, cualquiera podría regalarse pedidos con
 *      un `curl`. Si falla, 400 y no se toca nada.
 *   2. **Idempotencia.** Las pasarelas reintentan (y Paddle reintenta bastante).
 *      Si el id de evento ya estaba registrado, se responde 200 y se sale: el
 *      pedido ya existe y el correo ya salió.
 *   3. **Normalizar** el evento a un pedido nuestro. Los eventos que no son una
 *      compra se ignoran con 200, para que la pasarela no siga insistiendo.
 *   4. **Crear el pedido** y mandar el correo.
 *
 * Si algo revienta después del paso 2, se borra la marca del evento para que el
 * reintento de la pasarela pueda procesarlo: es preferible arriesgarse a un
 * duplicado (que la clave única de `referencia_proveedor` frena) que dejar a un
 * cliente pagado y sin producto.
 */
export async function POST(peticion: Request): Promise<Response> {
  const proveedor = proveedorDePago();

  let evento;
  try {
    evento = await proveedor.verificarWebhook(peticion);
  } catch (error) {
    if (error instanceof ErrorFirmaWebhook) {
      console.warn("[webhook] firma rechazada:", error.message);
      return new Response("Firma no válida", { status: 400 });
    }
    console.error("[webhook] no se ha podido leer el evento:", error);
    return new Response("Petición no válida", { status: 400 });
  }

  const esNuevo = await eventoWebhookEsNuevo(evento.id, evento.tipo, proveedor.nombre);

  if (!esNuevo) {
    return Response.json({ ok: true, duplicado: true });
  }

  try {
    const pedido = await proveedor.normalizarPedido(evento);

    if (!pedido) {
      await cerrarEventoWebhook(evento.id);
      return Response.json({ ok: true, ignorado: evento.tipo });
    }

    const producto = obtenerProducto(pedido.sku);
    if (!producto) {
      throw new Error(`El pedido apunta a un sku que no existe: «${pedido.sku}».`);
    }

    // Si ya existía (por ejemplo, dos eventos distintos para la misma
    // transacción), se reutiliza en vez de duplicar.
    const yaExistia = await pedidoPorReferencia(pedido.referenciaProveedor);
    const registro = yaExistia ?? (await crearPedido(pedido, proveedor.nombre));

    await registrarEvento("compra_completada", {
      sku: pedido.sku,
      importe_centimos: pedido.importeCentimos,
      moneda: pedido.moneda,
      pais: pedido.pais,
      proveedor: proveedor.nombre,
    });

    if (!yaExistia) {
      const ficheros = ficherosDelProducto(producto).map((fichero) => fichero.nombre);

      await enviarCorreo(
        correoCompra(
          registro.email,
          producto.titulo,
          ficheros,
          urlAbsoluta(`/checkout/exito?ref=${encodeURIComponent(registro.referenciaProveedor)}`),
          MESES_ACTUALIZACION,
          DIAS_GARANTIA,
        ),
      );
    }

    await cerrarEventoWebhook(evento.id);
    return Response.json({ ok: true, pedido: registro.id });
  } catch (error) {
    console.error("[webhook] fallo procesando el evento:", error);

    // Se libera el id para que el reintento de la pasarela pueda con él.
    await olvidarEventoWebhook(evento.id);

    return new Response("Error procesando el evento", { status: 500 });
  }
}

/** Un GET aquí solo puede ser alguien curioseando. */
export function GET(): Response {
  return new Response("Este endpoint solo acepta POST de la pasarela de pago.", {
    status: 405,
  });
}
