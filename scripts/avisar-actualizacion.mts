/**
 * Avisa por correo a quien compró un producto de que hay una versión nueva.
 *
 *   pnpm avisar-actualizacion pdf-excel-autonomos
 *   pnpm avisar-actualizacion pdf-excel-autonomos --de-verdad
 *
 * Sin `--de-verdad` solo enseña a quién escribiría y qué diría: siempre conviene
 * mirar la lista antes de mandar un correo a todos tus compradores.
 *
 * Esto es lo que hace real la promesa de «actualización gratuita 12 meses»:
 * solo se avisa a quien sigue en plazo, calculado desde la fecha de su compra.
 *
 * El script es autónomo a propósito (no importa nada de `src/`): así se puede
 * lanzar desde cualquier sitio con las variables de entorno cargadas.
 */

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";
import { Resend } from "resend";

const MESES_ACTUALIZACION = 12;

interface Fichero {
  nombre: string;
  ruta: string;
  version: string;
  actualizado: string;
}

function abortar(mensaje: string): never {
  console.error(`\n❌ ${mensaje}\n`);
  process.exit(1);
}

const [sku, ...opciones] = process.argv.slice(2);
const deVerdad = opciones.includes("--de-verdad");

if (!sku) {
  abortar('Falta el sku. Uso: pnpm avisar-actualizacion pdf-excel-autonomos [--de-verdad]');
}

const rutaProducto = path.join(process.cwd(), "content", "productos", `${sku}.mdx`);

if (!fs.existsSync(rutaProducto)) {
  abortar(`No existe content/productos/${sku}.mdx`);
}

const { data } = matter(fs.readFileSync(rutaProducto, "utf8"));
const titulo = String(data.titulo ?? sku);
const ficheros = (data.ficheros ?? []) as Fichero[];

if (ficheros.length === 0) {
  abortar(`El producto «${sku}» no declara ficheros.`);
}

const masReciente = ficheros.reduce((a, b) => (a.actualizado > b.actualizado ? a : b));

const urlSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL;
const claveServicio = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!urlSupabase || !claveServicio) {
  abortar("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
}

const supabase = createClient(urlSupabase, claveServicio, {
  auth: { persistSession: false },
});

const { data: pedidos, error } = await supabase
  .from("pedidos")
  .select("email, pagado_en, token_descarga")
  .eq("sku", sku);

if (error) abortar(`Supabase: ${error.message}`);

const ahora = Date.now();

const enPlazo = (pedidos ?? []).filter((pedido) => {
  const vence = new Date(pedido.pagado_en as string);
  vence.setUTCMonth(vence.getUTCMonth() + MESES_ACTUALIZACION);
  return vence.getTime() > ahora;
});

// Un correo por persona, aunque haya comprado dos veces.
const destinatarios = new Map<string, string>();
for (const pedido of enPlazo) {
  destinatarios.set(pedido.email as string, pedido.token_descarga as string);
}

console.log(
  [
    "",
    `Producto:        ${titulo}`,
    `Fichero nuevo:   ${masReciente.nombre} (versión ${masReciente.version})`,
    `Compradores:     ${pedidos?.length ?? 0}`,
    `En plazo:        ${destinatarios.size}`,
    `Modo:            ${deVerdad ? "ENVÍO REAL" : "simulación (añade --de-verdad para enviar)"}`,
    "",
  ].join("\n"),
);

if (destinatarios.size === 0) process.exit(0);

if (!deVerdad) {
  for (const email of destinatarios.keys()) console.log(`  · ${email}`);
  console.log("\nNadie ha recibido nada. Repite con --de-verdad cuando lo veas bien.\n");
  process.exit(0);
}

const claveResend = process.env.RESEND_API_KEY;
const remitente = process.env.EMAIL_REMITENTE;

if (!claveResend || !remitente) {
  abortar("Faltan RESEND_API_KEY o EMAIL_REMITENTE para poder enviar.");
}

const resend = new Resend(claveResend);
const base = (process.env.NEXT_PUBLIC_URL_SITIO ?? "http://localhost:3000").replace(/\/$/, "");

let enviados = 0;

for (const [email, token] of destinatarios) {
  const url = `${base}/api/descargar/${token}?f=${encodeURIComponent(masReciente.ruta)}`;

  const { error: fallo } = await resend.emails.send({
    from: remitente,
    to: email,
    subject: `Actualización de ${titulo}`,
    text: [
      `Hay una versión nueva de ${masReciente.nombre} (versión ${masReciente.version}).`,
      `Está incluida en ${titulo} y la actualización es gratuita: ya la tienes pagada.`,
      "",
      url,
      "",
      "Editorial Alcedo",
    ].join("\n"),
  });

  if (fallo) console.error(`  ✗ ${email}: ${fallo.message}`);
  else enviados++;
}

console.log(`\n✅ Enviados ${enviados} de ${destinatarios.size} correos.\n`);
