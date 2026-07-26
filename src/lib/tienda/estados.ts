/**
 * Estados de los formularios de la tienda.
 *
 * Viven fuera de los ficheros `"use server"` porque un módulo de acciones de
 * servidor **solo puede exportar funciones asíncronas**: si exporta también un
 * objeto, Next detiene el build. Aquí no hay directiva, así que lo puede importar
 * cualquiera, cliente o servidor.
 */

export type EstadoCompra = { estado: "inicial" } | { estado: "error"; mensaje: string };

export const ESTADO_COMPRA_INICIAL: EstadoCompra = { estado: "inicial" };

export type EstadoAcceso =
  | { estado: "inicial" }
  | { estado: "enviado"; email: string }
  | { estado: "error"; mensaje: string };

export const ESTADO_ACCESO_INICIAL: EstadoAcceso = { estado: "inicial" };
