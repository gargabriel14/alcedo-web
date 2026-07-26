/**
 * Estado del formulario de alta en la lista.
 *
 * Separado de la acción de servidor porque un fichero `"use server"` solo puede
 * exportar funciones asíncronas.
 */

export type EstadoAlta =
  | { estado: "inicial" }
  | {
      estado: "ok";
      email: string;
      /** Ya había confirmado antes: se le manda el fichero directamente. */
      yaConfirmado: boolean;
      /** `false` si el correo no llegó a salir (modo local o fallo de Resend). */
      correoEnviado: boolean;
      modoLocal: boolean;
    }
  | { estado: "error"; mensaje: string };

export const ESTADO_ALTA_INICIAL: EstadoAlta = { estado: "inicial" };
