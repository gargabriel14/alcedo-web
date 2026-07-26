import "server-only";

import { Resend } from "resend";

/**
 * Envío de correo transaccional con Resend.
 *
 * Si no hay `RESEND_API_KEY`, no se rompe nada: el correo se escribe en la
 * consola del servidor con su asunto, su destinatario y sus enlaces. Así se
 * puede recorrer el doble opt-in y la compra entera en local, y de paso se ve el
 * contenido del correo sin tener que mandárselo a nadie.
 */

export interface CorreoSalida {
  para: string;
  asunto: string;
  html: string;
  /** Versión en texto plano. Sube la entregabilidad y la lee cualquier cliente. */
  texto: string;
}

let resend: Resend | null = null;

function clienteResend(): Resend | null {
  if (resend) return resend;
  const clave = process.env.RESEND_API_KEY;
  if (!clave) return null;
  resend = new Resend(clave);
  return resend;
}

export function hayCorreoConfigurado(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_REMITENTE);
}

/**
 * Manda un correo. Devuelve `true` si salió de verdad.
 *
 * No lanza nunca: un fallo de correo no puede tumbar una compra que ya está
 * pagada. El comprador tiene su descarga inmediata en pantalla, y el fallo queda
 * registrado para poder reenviarlo.
 */
export async function enviarCorreo(correo: CorreoSalida): Promise<boolean> {
  const cliente = clienteResend();
  const remitente = process.env.EMAIL_REMITENTE;

  if (!cliente || !remitente) {
    console.info(
      [
        "",
        "──────── CORREO (modo local, no se ha enviado) ────────",
        `Para:   ${correo.para}`,
        `Asunto: ${correo.asunto}`,
        "",
        correo.texto,
        "───────────────────────────────────────────────────────",
        "",
      ].join("\n"),
    );
    return false;
  }

  try {
    const { error } = await cliente.emails.send({
      from: remitente,
      to: correo.para,
      subject: correo.asunto,
      html: correo.html,
      text: correo.texto,
    });

    if (error) {
      console.error("[correo] Resend ha devuelto error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[correo] no se ha podido enviar:", error);
    return false;
  }
}
