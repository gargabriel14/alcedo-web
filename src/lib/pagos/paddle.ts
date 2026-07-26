import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { obtenerProducto } from "@/lib/contenido/productos";
import {
  ErrorFirmaWebhook,
  type EventoVerificado,
  type Pedido,
  type ProveedorPago,
  type ResultadoCheckout,
} from "@/lib/pagos/tipos";

/**
 * Adaptador de Paddle Billing.
 *
 * Hablamos con su API REST directamente, sin SDK. Son tres llamadas y así el
 * bundle no engorda, no heredamos sus dependencias y la superficie de cambio si
 * mañana migramos es este único fichero.
 *
 * Paddle es *merchant of record*: es el vendedor legal frente al cliente, emite
 * la factura y liquida el IVA de cada país. Por eso aquí no hay ni una línea de
 * lógica fiscal, y el importe que guardamos es el que Paddle nos dice que se ha
 * cobrado.
 *
 * ⚠️ Pendiente de comprobar contra eventos reales cuando la cuenta esté aprobada.
 * Está escrito siguiendo la documentación de Paddle Billing, pero hasta que no
 * llegue un webhook de verdad no se puede dar por validado.
 */

/** Margen de tolerancia del reloj para el sello de tiempo de la firma. */
const SEGUNDOS_TOLERANCIA = 5 * 60;

interface RespuestaTransaccion {
  data?: { id?: string; checkout?: { url?: string | null } | null };
  error?: { detail?: string };
}

interface RespuestaCliente {
  data?: { email?: string };
}

export class ProveedorPaddle implements ProveedorPago {
  readonly nombre = "paddle";
  readonly esSimulado = false;

  private readonly claveApi: string;
  private readonly secretoWebhook: string;
  private readonly baseApi: string;

  constructor() {
    const claveApi = process.env.PADDLE_API_KEY;
    const secretoWebhook = process.env.PADDLE_SECRETO_WEBHOOK;

    if (!claveApi || !secretoWebhook) {
      throw new Error(
        "Faltan PADDLE_API_KEY o PADDLE_SECRETO_WEBHOOK. Con PROVEEDOR_PAGO=paddle son obligatorias.",
      );
    }

    this.claveApi = claveApi;
    this.secretoWebhook = secretoWebhook;
    this.baseApi =
      process.env.PADDLE_ENTORNO === "production"
        ? "https://api.paddle.com"
        : "https://sandbox-api.paddle.com";
  }

  async crearCheckout(sku: string, email?: string): Promise<ResultadoCheckout> {
    const producto = obtenerProducto(sku);

    if (!producto || !producto.activo) {
      throw new Error(`El producto «${sku}» no existe o no está a la venta.`);
    }

    if (!producto.idProveedorPago) {
      throw new Error(
        `El producto «${sku}» no tiene «idProveedorPago». Crea el precio en Paddle y pega su id en content/productos/${sku}.mdx.`,
      );
    }

    const respuesta = await fetch(`${this.baseApi}/transactions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.claveApi}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ price_id: producto.idProveedorPago, quantity: 1 }],
        // Viaja de ida y vuelta: así el webhook sabe qué se compró sin tener que
        // deducirlo del id de precio.
        custom_data: { sku: producto.sku, ...(email ? { email } : {}) },
      }),
    });

    const cuerpo = (await respuesta.json()) as RespuestaTransaccion;

    if (!respuesta.ok || !cuerpo.data?.id) {
      throw new Error(
        `Paddle no ha podido abrir el pago: ${cuerpo.error?.detail ?? respuesta.status}`,
      );
    }

    const url = cuerpo.data.checkout?.url;
    if (!url) {
      throw new Error(
        "Paddle no ha devuelto URL de checkout. Revisa que el precio tenga el checkout alojado activado.",
      );
    }

    return { url, referencia: cuerpo.data.id };
  }

  async verificarWebhook(peticion: Request): Promise<EventoVerificado> {
    const cabecera = peticion.headers.get("paddle-signature");
    if (!cabecera) throw new ErrorFirmaWebhook("falta la cabecera Paddle-Signature");

    const { ts, h1 } = this.trocearCabecera(cabecera);
    if (!ts || !h1) throw new ErrorFirmaWebhook("la cabecera no trae ts y h1");

    // Sin esta comprobación, una petición interceptada se podría reenviar
    // indefinidamente con su firma válida.
    const edad = Math.abs(Date.now() / 1000 - Number(ts));
    if (!Number.isFinite(edad) || edad > SEGUNDOS_TOLERANCIA) {
      throw new ErrorFirmaWebhook("el sello de tiempo está fuera de tolerancia");
    }

    // El cuerpo se lee en crudo: cualquier reserialización cambiaría el hash.
    const crudo = await peticion.text();
    const esperado = createHmac("sha256", this.secretoWebhook)
      .update(`${ts}:${crudo}`)
      .digest("hex");

    if (!this.sonIguales(esperado, h1)) {
      throw new ErrorFirmaWebhook("el hash no coincide");
    }

    const datos = JSON.parse(crudo) as { event_id?: string; event_type?: string };

    if (!datos.event_id || !datos.event_type) {
      throw new ErrorFirmaWebhook("el evento no trae event_id o event_type");
    }

    return { id: datos.event_id, tipo: datos.event_type, datos: JSON.parse(crudo) };
  }

  async normalizarPedido(evento: EventoVerificado): Promise<Pedido | null> {
    // Nos interesa un único evento: el pago consumado. Todo lo demás se ignora
    // en silencio y se responde 200 para que Paddle no reintente.
    if (evento.tipo !== "transaction.completed") return null;

    const datos = (evento.datos as { data?: Record<string, unknown> }).data;
    if (!datos) throw new Error("El evento de Paddle no trae «data».");

    const idTransaccion = datos.id;
    if (typeof idTransaccion !== "string") {
      throw new Error("El evento de Paddle no trae el id de la transacción.");
    }

    const propios = (datos.custom_data ?? {}) as { sku?: unknown; email?: unknown };
    if (typeof propios.sku !== "string") {
      throw new Error(
        `La transacción ${idTransaccion} no trae «sku» en custom_data. Revisa crearCheckout.`,
      );
    }

    const producto = obtenerProducto(propios.sku);
    if (!producto) {
      throw new Error(`La transacción ${idTransaccion} apunta a un sku desconocido.`);
    }

    const email =
      typeof propios.email === "string" && propios.email
        ? propios.email
        : await this.emailDelCliente(datos.customer_id);

    const totales = (datos.details as { totals?: { grand_total?: unknown } } | undefined)
      ?.totals;
    const importe = Number(totales?.grand_total);

    return {
      referenciaProveedor: idTransaccion,
      email,
      sku: producto.sku,
      // Paddle da los importes en la unidad menor y como texto.
      importeCentimos: Number.isFinite(importe)
        ? importe
        : Math.round(producto.precioEUR * 100),
      moneda: typeof datos.currency_code === "string" ? datos.currency_code : "EUR",
      pais: this.paisDe(datos),
      pagadoEn:
        typeof datos.billed_at === "string" ? datos.billed_at : new Date().toISOString(),
    };
  }

  /** `ts=123;h1=abc` → `{ ts: '123', h1: 'abc' }`. */
  private trocearCabecera(cabecera: string): { ts?: string; h1?: string } {
    const partes: Record<string, string> = {};

    for (const trozo of cabecera.split(";")) {
      const [clave, valor] = trozo.split("=");
      if (clave && valor) partes[clave.trim()] = valor.trim();
    }

    return { ts: partes.ts, h1: partes.h1 };
  }

  /** Comparación en tiempo constante: una comparación normal filtra información. */
  private sonIguales(a: string, b: string): boolean {
    const bufferA = Buffer.from(a, "utf8");
    const bufferB = Buffer.from(b, "utf8");
    if (bufferA.length !== bufferB.length) return false;
    return timingSafeEqual(bufferA, bufferB);
  }

  private async emailDelCliente(idCliente: unknown): Promise<string> {
    if (typeof idCliente !== "string") {
      throw new Error("La transacción no trae ni email ni customer_id.");
    }

    const respuesta = await fetch(`${this.baseApi}/customers/${idCliente}`, {
      headers: { Authorization: `Bearer ${this.claveApi}` },
    });

    const cuerpo = (await respuesta.json()) as RespuestaCliente;

    if (!respuesta.ok || !cuerpo.data?.email) {
      throw new Error(`No se ha podido obtener el correo del cliente ${idCliente}.`);
    }

    return cuerpo.data.email;
  }

  private paisDe(datos: Record<string, unknown>): string | null {
    const direccion = (datos.billing_details ?? datos.address) as
      | { country_code?: unknown }
      | undefined;

    return typeof direccion?.country_code === "string" ? direccion.country_code : null;
  }
}
