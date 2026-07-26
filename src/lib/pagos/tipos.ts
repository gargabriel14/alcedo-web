/**
 * El vocabulario propio de la tienda.
 *
 * Estos tipos son nuestros, no de la pasarela. Todo lo que entra desde Paddle (o
 * de quien la sustituya) se traduce a esto en la frontera, y de ahí para dentro
 * la aplicación no sabe con quién está cobrando. Es lo que permite cambiar de
 * proveedor escribiendo un fichero nuevo en vez de rehacer la tienda.
 */

/** Lo que devuelve el proveedor cuando se abre un pago. */
export interface ResultadoCheckout {
  /** A dónde se manda al comprador. */
  url: string;
  /** Referencia del proveedor, para poder trazar el pago después. */
  referencia: string;
}

/** Un evento de webhook cuya firma ya se ha comprobado. */
export interface EventoVerificado {
  /**
   * Id del evento **en la pasarela**. Es la clave de la idempotencia: si llega
   * dos veces el mismo id, el segundo se descarta.
   */
  id: string;
  /** Tipo tal y como lo nombra la pasarela, para diagnóstico. */
  tipo: string;
  /** Cuerpo original, ya parseado. Solo lo mira el adaptador. */
  datos: unknown;
}

/** Un pedido nuestro, ya normalizado y listo para guardar. */
export interface Pedido {
  /** Id de la transacción en la pasarela. Único por pedido. */
  referenciaProveedor: string;
  email: string;
  sku: string;
  /** En céntimos y como entero: nunca se guarda dinero en coma flotante. */
  importeCentimos: number;
  moneda: string;
  /** Código de país de la compra, si la pasarela lo da. Solo para estadística. */
  pais: string | null;
  /** Momento del pago, en ISO. */
  pagadoEn: string;
}

/**
 * Contrato del proveedor de pago.
 *
 * Cualquier pasarela nueva implementa estos tres métodos y no toca nada más:
 * ni rutas, ni componentes, ni base de datos.
 */
export interface ProveedorPago {
  /** Nombre corto, para logs y para la pantalla de compra. */
  readonly nombre: string;

  /** `true` cuando no cobra dinero de verdad. La interfaz lo avisa en pantalla. */
  readonly esSimulado: boolean;

  /**
   * Abre un pago para un SKU.
   *
   * El precio **no se recibe**: se busca en el catálogo del servidor a partir del
   * SKU. El email es opcional y solo sirve para que la pasarela lo traiga escrito.
   */
  crearCheckout(sku: string, email?: string): Promise<ResultadoCheckout>;

  /**
   * Comprueba la firma del webhook y devuelve el evento.
   * Lanza si la firma no es válida: quien llama no tiene que decidir nada.
   */
  verificarWebhook(peticion: Request): Promise<EventoVerificado>;

  /**
   * Traduce el evento a un pedido nuestro.
   * Devuelve `null` si el evento no es una compra completada, que es la mayoría.
   */
  normalizarPedido(evento: EventoVerificado): Promise<Pedido | null>;
}

/** Error de firma inválida: el webhook responde 400 y no procesa nada. */
export class ErrorFirmaWebhook extends Error {
  constructor(motivo: string) {
    super(`Firma de webhook no válida: ${motivo}`);
    this.name = "ErrorFirmaWebhook";
  }
}
