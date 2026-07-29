/**
 * Estado del formulario de propuesta de libro.
 * Separado de la acción porque un fichero `"use server"` solo puede exportar
 * funciones asíncronas.
 */

export type EstadoPropuesta =
  | { estado: "inicial" }
  | { estado: "ok"; nombre: string; avisoEnviado: boolean }
  | { estado: "error"; mensaje: string };

export const ESTADO_PROPUESTA_INICIAL: EstadoPropuesta = { estado: "inicial" };
