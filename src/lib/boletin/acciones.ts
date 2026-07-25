"use server";

import { z } from "zod";

/**
 * Alta en la lista de correo a cambio de un lead magnet.
 *
 * FASE 1 — valida en servidor y responde, pero TODAVÍA NO GUARDA NI ENVÍA NADA.
 * En la Fase 3 este mismo punto de entrada hará: alta en Supabase con
 * `confirmado = false`, correo de confirmación con Resend (doble opt-in), y
 * entrega del fichero con URL firmada de 24 h solo después de confirmar.
 *
 * La validación vive en el servidor a propósito: el cliente puede saltarse
 * cualquier comprobación, así que la del navegador es comodidad, no seguridad.
 */

const esquemaAlta = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Ese correo no parece válido. Revísalo, por favor." })),
  recurso: z.string().min(1, { message: "Falta indicar qué recurso se descarga." }),
  /** Trampa para bots: es invisible para las personas, así que debe ir vacía. */
  web: z.string().max(0).optional(),
});

export type EstadoAlta =
  | { estado: "inicial" }
  | { estado: "ok"; email: string }
  | { estado: "error"; mensaje: string };

export const ESTADO_ALTA_INICIAL: EstadoAlta = { estado: "inicial" };

export async function altaEnBoletin(
  _estadoPrevio: EstadoAlta,
  datos: FormData,
): Promise<EstadoAlta> {
  const resultado = esquemaAlta.safeParse({
    email: datos.get("email"),
    recurso: datos.get("recurso"),
    web: datos.get("web") ?? "",
  });

  if (!resultado.success) {
    const primerError = resultado.error.issues[0];
    return {
      estado: "error",
      mensaje: primerError?.message ?? "No hemos podido procesar el formulario.",
    };
  }

  // Bot detectado: respondemos como si todo hubiera ido bien y no hacemos nada.
  if (resultado.data.web) {
    return { estado: "ok", email: resultado.data.email };
  }

  // TODO(Fase 3): alta en Supabase + correo de confirmación con Resend +
  // evento `lead_captado` en la tabla de eventos.
  if (process.env.NODE_ENV === "development") {
    console.info(
      `[boletín] alta pendiente de integración: ${resultado.data.email} → ${resultado.data.recurso}`,
    );
  }

  return { estado: "ok", email: resultado.data.email };
}
