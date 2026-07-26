import "server-only";

import type { CorreoSalida } from "@/lib/correo/enviar";
import { SITIO, urlAbsoluta } from "@/lib/sitio";

/**
 * Plantillas de los correos.
 *
 * HTML sencillo y con estilos en línea a propósito: los clientes de correo no
 * entienden hojas de estilo modernas, y un correo que llega roto cuesta ventas.
 * Nada de imágenes remotas ni de tipografías externas, que disparan los filtros
 * de spam y no se ven en la mitad de los clientes.
 *
 * Todos llevan versión en texto plano, que es la que leen los filtros y algunos
 * lectores de pantalla.
 */

const ANCHO = "560px";

function envoltorio(contenido: string): string {
  return `<!doctype html>
<html lang="es">
<body style="margin:0;padding:24px 12px;background:#faf8f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:${ANCHO};margin:0 auto;background:#ffffff;border:1px solid #e3dccd;border-radius:10px;">
    <tr><td style="height:6px;background:#0e7c9b;border-radius:10px 10px 0 0;"></td></tr>
    <tr><td style="padding:28px 28px 8px;">
      <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#57534e;font-weight:600;">Editorial Alcedo</p>
    </td></tr>
    <tr><td style="padding:0 28px 28px;font-size:15px;line-height:1.65;">
      ${contenido}
    </td></tr>
    <tr><td style="padding:18px 28px;border-top:1px solid #e3dccd;font-size:12px;line-height:1.6;color:#57534e;">
      <p style="margin:0;">Editorial Alcedo · «${SITIO.claim}»</p>
      <p style="margin:6px 0 0;">Recibes este correo porque lo has pedido tú en ${SITIO.url}.</p>
    </td></tr>
  </table>
</body>
</html>`;
}

function boton(texto: string, url: string): string {
  return `<p style="margin:24px 0;">
    <a href="${url}" style="display:inline-block;background:#0e7c9b;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:6px;font-weight:600;font-size:15px;">${texto}</a>
  </p>`;
}

// ---------------------------------------------------------------------------
// Doble opt-in
// ---------------------------------------------------------------------------

export function correoConfirmacion(
  para: string,
  token: string,
  nombreRecurso: string,
): CorreoSalida {
  const url = urlAbsoluta(`/confirmar/${token}`);

  return {
    para,
    asunto: `Confirma tu correo y descarga: ${nombreRecurso}`,
    html: envoltorio(`
      <h1 style="margin:0 0 14px;font-size:22px;line-height:1.25;">Un clic y es tuya</h1>
      <p style="margin:0 0 6px;">Has pedido <strong>${nombreRecurso}</strong>. Confirma que este correo es tuyo y te la damos ahora mismo.</p>
      ${boton("Confirmar y descargar", url)}
      <p style="margin:0;font-size:13px;color:#57534e;">Si el botón no funciona, copia esta dirección en tu navegador:<br><span style="word-break:break-all;">${url}</span></p>
      <p style="margin:16px 0 0;font-size:13px;color:#57534e;">El enlace caduca en 48 horas. Si no has pedido nada, ignora este correo y no pasará nada.</p>
    `),
    texto: [
      `Has pedido: ${nombreRecurso}`,
      "",
      "Confirma que este correo es tuyo y te la damos ahora mismo:",
      url,
      "",
      "El enlace caduca en 48 horas.",
      "Si no has pedido nada, ignora este correo.",
      "",
      "Editorial Alcedo",
    ].join("\n"),
  };
}

export function correoEntregaRecurso(
  para: string,
  nombreRecurso: string,
  urlDescarga: string,
): CorreoSalida {
  return {
    para,
    asunto: `Aquí tienes: ${nombreRecurso}`,
    html: envoltorio(`
      <h1 style="margin:0 0 14px;font-size:22px;line-height:1.25;">Aquí la tienes</h1>
      <p style="margin:0 0 6px;"><strong>${nombreRecurso}</strong>, lista para usar.</p>
      ${boton("Descargar ahora", urlDescarga)}
      <p style="margin:0;font-size:13px;color:#57534e;">El enlace es válido 24 horas. Si caduca, escríbenos y te mandamos otro.</p>
      <p style="margin:16px 0 0;">Te escribiremos cuando publiquemos algo que te sirva. Ni más, ni con más frecuencia. Puedes darte de baja desde cualquier correo nuestro.</p>
    `),
    texto: [
      `${nombreRecurso}, lista para usar.`,
      "",
      "Descárgala aquí (enlace válido 24 horas):",
      urlDescarga,
      "",
      "Editorial Alcedo",
    ].join("\n"),
  };
}

// ---------------------------------------------------------------------------
// Compra
// ---------------------------------------------------------------------------

export function correoCompra(
  para: string,
  tituloProducto: string,
  ficheros: readonly string[],
  urlDescarga: string,
  mesesActualizacion: number,
  diasGarantia: number,
): CorreoSalida {
  const lista = ficheros
    .map(
      (fichero) =>
        `<li style="margin:0 0 4px;">${fichero}</li>`,
    )
    .join("");

  return {
    para,
    asunto: `Tu compra: ${tituloProducto}`,
    html: envoltorio(`
      <h1 style="margin:0 0 14px;font-size:22px;line-height:1.25;">Gracias. Aquí está todo</h1>
      <p style="margin:0 0 6px;">Has comprado <strong>${tituloProducto}</strong>. Esto es lo que incluye:</p>
      <ul style="margin:12px 0 0;padding-left:20px;color:#57534e;">${lista}</ul>
      ${boton("Ir a mis descargas", urlDescarga)}
      <p style="margin:0;font-size:13px;color:#57534e;">Guarda este correo: el enlace sirve durante 30 días y permite hasta 5 descargas. Después, y siempre, puedes volver a descargarlo desde tu cuenta.</p>
      <p style="margin:18px 0 0;">Durante <strong>${mesesActualizacion} meses</strong> recibirás gratis cualquier actualización del material. Y si no te sirve, tienes <strong>${diasGarantia} días</strong> para pedir la devolución sin dar explicaciones: responde a este correo y ya está.</p>
    `),
    texto: [
      `Has comprado: ${tituloProducto}`,
      "",
      "Incluye:",
      ...ficheros.map((fichero) => `  - ${fichero}`),
      "",
      "Descarga aquí:",
      urlDescarga,
      "",
      "El enlace sirve 30 días y permite hasta 5 descargas.",
      `Actualizaciones gratis durante ${mesesActualizacion} meses.`,
      `Garantía de devolución de ${diasGarantia} días: responde a este correo.`,
      "",
      "Editorial Alcedo",
    ].join("\n"),
  };
}

export function correoActualizacion(
  para: string,
  tituloProducto: string,
  nombreFichero: string,
  version: string,
  urlDescarga: string,
): CorreoSalida {
  return {
    para,
    asunto: `Actualización de ${tituloProducto}`,
    html: envoltorio(`
      <h1 style="margin:0 0 14px;font-size:22px;line-height:1.25;">Hemos actualizado tu material</h1>
      <p style="margin:0 0 6px;">Hay una versión nueva de <strong>${nombreFichero}</strong> (versión ${version}), incluida en <strong>${tituloProducto}</strong>.</p>
      <p style="margin:0;">Ya lo tienes pagado: la actualización es gratuita.</p>
      ${boton("Descargar la versión nueva", urlDescarga)}
    `),
    texto: [
      `Hay una versión nueva de ${nombreFichero} (versión ${version}).`,
      `Está incluida en ${tituloProducto} y la actualización es gratuita.`,
      "",
      urlDescarga,
      "",
      "Editorial Alcedo",
    ].join("\n"),
  };
}
