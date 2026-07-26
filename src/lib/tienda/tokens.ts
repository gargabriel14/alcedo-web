import "server-only";

import { randomBytes } from "node:crypto";

/**
 * Tokens opacos para enlaces de descarga y de confirmación.
 *
 * Se usan tokens aleatorios guardados en base de datos en vez de tokens firmados
 * tipo JWT. Es una decisión consciente:
 *
 * - Un token firmado no se puede **revocar**: si alguien publica su enlace en un
 *   foro, no hay forma de cortarlo hasta que caduque.
 * - Con el token en base de datos se lleva la cuenta de descargas, se puede
 *   invalidar, y regenerar uno nuevo desde el área de cliente es trivial.
 * - No hay secreto que rotar ni que filtrar.
 *
 * 32 bytes aleatorios son 256 bits: no se adivina por fuerza bruta.
 */
export function generarToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Días que dura el enlace de descarga que se manda por correo. */
export const DIAS_TOKEN_DESCARGA = 30;

/** Horas que dura el enlace de confirmación del doble opt-in. */
export const HORAS_TOKEN_CONFIRMACION = 48;

/** Descargas por pedido antes de tener que entrar en la cuenta a regenerar. */
export const LIMITE_DESCARGAS = 5;

/** Duración de las URL firmadas de Supabase Storage, en segundos. */
export const SEGUNDOS_URL_FIRMADA = 24 * 60 * 60;

export function fechaDentroDe(dias: number): string {
  return new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString();
}

export function fechaDentroDeHoras(horas: number): string {
  return new Date(Date.now() + horas * 60 * 60 * 1000).toISOString();
}
