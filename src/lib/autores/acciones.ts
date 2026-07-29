"use server";

import { z } from "zod";
import type { EstadoPropuesta } from "@/lib/autores/estado";
import { enviarCorreo } from "@/lib/correo/enviar";

/**
 * Propuesta de libro para el sello Alcedo Autores.
 *
 * Cuatro campos y ninguno de relleno: quién eres, cómo te escribimos, qué sabes
 * hacer y a quién se lo has enseñado ya. Con eso se decide si merece una
 * conversación. Pedir un manuscrito de entrada espanta a los buenos, que suelen
 * ser profesionales con poco tiempo.
 */

const esquema = z.object({
  nombre: z.string().trim().min(2, { message: "Dinos cómo te llamas." }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Ese correo no parece válido." })),
  tema: z
    .string()
    .trim()
    .min(20, { message: "Cuéntanos el tema con un poco más de detalle." })
    .max(400),
  experiencia: z
    .string()
    .trim()
    .min(20, { message: "Cuéntanos qué has resuelto tú de esto." })
    .max(800),
  web: z.string().max(0).optional(),
});

export async function proponerLibro(
  _estadoPrevio: EstadoPropuesta,
  datos: FormData,
): Promise<EstadoPropuesta> {
  const resultado = esquema.safeParse({
    nombre: datos.get("nombre"),
    email: datos.get("email"),
    tema: datos.get("tema"),
    experiencia: datos.get("experiencia"),
    web: datos.get("web") ?? "",
  });

  if (!resultado.success) {
    return {
      estado: "error",
      mensaje: resultado.error.issues[0]?.message ?? "Revisa los datos, por favor.",
    };
  }

  const propuesta = resultado.data;

  // Bot: se responde como si nada y no se manda ningún aviso.
  if (propuesta.web) {
    return { estado: "ok", nombre: propuesta.nombre, avisoEnviado: true };
  }

  const destino = process.env.EMAIL_INTERNO;

  const enviado = destino
    ? await enviarCorreo({
        para: destino,
        asunto: `Propuesta de libro: ${propuesta.nombre}`,
        html: `<p><strong>${propuesta.nombre}</strong> · ${propuesta.email}</p><p><strong>Tema:</strong><br>${propuesta.tema}</p><p><strong>Experiencia:</strong><br>${propuesta.experiencia}</p>`,
        texto: [
          `Nombre: ${propuesta.nombre}`,
          `Correo: ${propuesta.email}`,
          "",
          "Tema:",
          propuesta.tema,
          "",
          "Experiencia:",
          propuesta.experiencia,
        ].join("\n"),
      })
    : false;

  if (!destino) {
    console.info("[autores] propuesta recibida sin EMAIL_INTERNO configurado:", propuesta);
  }

  return { estado: "ok", nombre: propuesta.nombre, avisoEnviado: enviado };
}
