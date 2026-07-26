"use server";

import { z } from "zod";
import { enviarCorreo } from "@/lib/correo/enviar";
import { correoConfirmacion, correoEntregaRecurso } from "@/lib/correo/plantillas";
import type { EstadoAlta } from "@/lib/boletin/estado";
import { obtenerRecurso } from "@/lib/datos/recursos";
import {
  altaSuscriptor,
  modoLocal,
  registrarEvento,
  urlFirmadaDeFichero,
} from "@/lib/tienda/almacen";

/**
 * Alta en la lista de correo a cambio de un lead magnet, con doble opt-in.
 *
 * El fichero **no se entrega aquí**: primero se manda un correo con un enlace de
 * confirmación. Es un paso más y cuesta algunas altas, pero sin él la lista se
 * llena de direcciones inventadas y de errores de tecleo, la tasa de rebote sube
 * y el dominio acaba en spam. Una lista de mil correos confirmados vale más que
 * una de cinco mil sin confirmar.
 *
 * La validación vive en el servidor a propósito: la del navegador es comodidad,
 * no seguridad.
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

  const { email, recurso: slugRecurso, web } = resultado.data;

  // Bot detectado: se responde como si todo hubiera ido bien y no se hace nada.
  if (web) {
    return {
      estado: "ok",
      email,
      yaConfirmado: false,
      correoEnviado: true,
      modoLocal: false,
    };
  }

  const recurso = obtenerRecurso(slugRecurso);
  if (!recurso) {
    return { estado: "error", mensaje: "Ese recurso ya no está disponible." };
  }

  try {
    const { token, yaEstaba } = await altaSuscriptor(email, recurso.slug);

    await registrarEvento("lead_captado", {
      recurso: recurso.slug,
      confirmado: yaEstaba,
    });

    // Si ya había confirmado antes, no se le hace pasar otra vez por el aro:
    // se le manda el fichero directamente.
    if (yaEstaba) {
      const url = await urlFirmadaDeFichero(recurso.fichero.ruta);
      const enviado = url
        ? await enviarCorreo(correoEntregaRecurso(email, recurso.titulo, url))
        : false;

      return {
        estado: "ok",
        email,
        yaConfirmado: true,
        correoEnviado: enviado,
        modoLocal: modoLocal(),
      };
    }

    const enviado = await enviarCorreo(
      correoConfirmacion(email, token, recurso.titulo),
    );

    return {
      estado: "ok",
      email,
      yaConfirmado: false,
      correoEnviado: enviado,
      modoLocal: modoLocal(),
    };
  } catch (error) {
    console.error("[boletín] fallo al dar de alta:", error);
    return {
      estado: "error",
      mensaje:
        "Algo ha fallado por nuestra parte. Inténtalo de nuevo en un minuto, por favor.",
    };
  }
}
