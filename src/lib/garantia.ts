/**
 * Garantía y actualizaciones: las dos promesas del Compromiso Alcedo que el
 * código tiene que poder demostrar.
 *
 * Ninguna de las dos se anuncia en la web sin que estas funciones puedan
 * responder, para una compra concreta y en una fecha concreta, si sigue vigente.
 * En la Fase 3 esto alimenta:
 *   - `/cuenta`: «te quedan 9 días de garantía» junto a cada compra.
 *   - el endpoint de descarga: los ficheros de un pedido con actualizaciones
 *     vigentes sirven siempre la última versión.
 *   - el aviso al comprador cuando se publica una versión nueva.
 *
 * Nota legal (no es asesoramiento): en productos digitales ya descargados el
 * derecho de desistimiento se puede excluir si se informa al cliente
 * (art. 103.m TRLGDCU). La garantía de 14 días de Alcedo es por tanto una
 * **garantía comercial voluntaria**, más generosa que el mínimo legal. Se puede
 * ofrecer y se puede retirar, pero mientras se anuncie hay que cumplirla: por eso
 * la cuenta atrás la lleva el sistema y no la memoria de nadie.
 */

/** Días naturales de garantía comercial desde la compra. */
export const DIAS_GARANTIA = 14;

/** Meses de actualizaciones gratuitas del fichero comprado. */
export const MESES_ACTUALIZACION = 12;

const MS_POR_DIA = 24 * 60 * 60 * 1000;

export interface VentanaTemporal {
  /** `true` si la ventana sigue abierta en el momento consultado. */
  vigente: boolean;
  /** Días naturales completos que quedan. 0 si ya venció. */
  diasRestantes: number;
  /** Instante exacto en el que vence. */
  vence: Date;
}

/**
 * Fin del día (23:59:59.999 UTC) de la fecha indicada.
 * El cliente se queda con el día entero: si compra el 3 a las 23:50, no pierde
 * un día de garantía por haber comprado tarde.
 */
function finDelDia(fecha: Date): Date {
  const fin = new Date(fecha);
  fin.setUTCHours(23, 59, 59, 999);
  return fin;
}

function calcularVentana(vence: Date, ahora: Date): VentanaTemporal {
  const restanteMs = vence.getTime() - ahora.getTime();

  return {
    vigente: restanteMs > 0,
    diasRestantes: restanteMs > 0 ? Math.ceil(restanteMs / MS_POR_DIA) : 0,
    vence,
  };
}

/** Estado de la garantía de devolución de una compra. */
export function estadoGarantia(fechaCompra: Date, ahora: Date = new Date()): VentanaTemporal {
  const vence = finDelDia(new Date(fechaCompra.getTime() + DIAS_GARANTIA * MS_POR_DIA));
  return calcularVentana(vence, ahora);
}

/** Estado del derecho a actualizaciones gratuitas de una compra. */
export function estadoActualizaciones(
  fechaCompra: Date,
  ahora: Date = new Date(),
): VentanaTemporal {
  const vence = new Date(fechaCompra);
  vence.setUTCMonth(vence.getUTCMonth() + MESES_ACTUALIZACION);
  return calcularVentana(finDelDia(vence), ahora);
}

/**
 * Texto para el cliente. Se usa igual en el área de cuenta y en el correo de
 * compra, así que la cuenta atrás dice siempre lo mismo en los dos sitios.
 */
export function textoGarantia(estado: VentanaTemporal): string {
  if (!estado.vigente) return "Garantía de devolución vencida";
  if (estado.diasRestantes === 1) return "Te queda 1 día de garantía";
  return `Te quedan ${estado.diasRestantes} días de garantía`;
}
