import "server-only";

import { ProveedorPaddle } from "@/lib/pagos/paddle";
import { ProveedorSimulado } from "@/lib/pagos/simulado";
import type { ProveedorPago } from "@/lib/pagos/tipos";

export type {
  EventoVerificado,
  Pedido,
  ProveedorPago,
  ResultadoCheckout,
} from "@/lib/pagos/tipos";
export { ErrorFirmaWebhook } from "@/lib/pagos/tipos";

/**
 * Punto de entrada único a la pasarela de pago.
 *
 * **Regla del proyecto: nada fuera de `src/lib/pagos/` importa un SDK de pago.**
 * Todo el resto de la aplicación pide el proveedor aquí y usa los tres métodos
 * del contrato. Cambiar Paddle por Lemon Squeezy o Gumroad es escribir una clase
 * nueva al lado de `paddle.ts` y añadir una línea en esta función.
 *
 * El proveedor se elige con la variable `PROVEEDOR_PAGO`. Por defecto, el
 * simulado: es lo que permite desarrollar y probar la compra entera sin
 * credenciales mientras Paddle revisa la cuenta.
 */
let instancia: ProveedorPago | null = null;

export function proveedorDePago(): ProveedorPago {
  if (instancia) return instancia;

  const elegido = (process.env.PROVEEDOR_PAGO ?? "simulado").toLowerCase();

  switch (elegido) {
    case "paddle":
      instancia = new ProveedorPaddle();
      break;

    case "simulado":
      instancia = new ProveedorSimulado();
      break;

    default:
      throw new Error(
        `PROVEEDOR_PAGO=«${elegido}» no existe. Valores admitidos: simulado, paddle.`,
      );
  }

  return instancia;
}

/** Solo para los tests: obliga a releer la variable de entorno. */
export function reiniciarProveedor(): void {
  instancia = null;
}
