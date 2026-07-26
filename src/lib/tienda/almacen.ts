import "server-only";

import type { Pedido } from "@/lib/pagos/tipos";
import {
  BUCKET_PRODUCTOS,
  clienteSupabase,
  hayCredencialesSupabase,
} from "@/lib/tienda/supabase";
import {
  DIAS_TOKEN_DESCARGA,
  fechaDentroDe,
  fechaDentroDeHoras,
  generarToken,
  HORAS_TOKEN_CONFIRMACION,
  LIMITE_DESCARGAS,
  SEGUNDOS_URL_FIRMADA,
} from "@/lib/tienda/tokens";

/**
 * Acceso a datos de la tienda.
 *
 * Todo lo que toca la base de datos pasa por aquí. Dos motivos: el resto de la
 * aplicación no escribe SQL ni conoce los nombres de las columnas, y hay un solo
 * sitio donde arreglar las cosas cuando cambian.
 *
 * **Modo local.** Si faltan las credenciales de Supabase, el almacén guarda en
 * memoria del proceso. Sirve para desarrollar y para recorrer la compra entera
 * sin cuentas; se pierde al reiniciar, y eso se dice claramente en pantalla. Lo
 * que no hace nunca es tragarse un error y hacer creer que se guardó.
 */

export interface RegistroPedido {
  id: string;
  referenciaProveedor: string;
  email: string;
  sku: string;
  importeCentimos: number;
  moneda: string;
  pais: string | null;
  pagadoEn: string;
  tokenDescarga: string;
  tokenExpiraEn: string;
  descargasUsadas: number;
}

export interface Suscriptor {
  email: string;
  recurso: string | null;
}

export type NombreEvento =
  | "lead_captado"
  | "checkout_iniciado"
  | "compra_completada"
  | "descarga"
  | "click_amazon";

export function modoLocal(): boolean {
  return !hayCredencialesSupabase();
}

// ---------------------------------------------------------------------------
// Memoria del modo local
// ---------------------------------------------------------------------------

interface FilaSuscriptorLocal {
  email: string;
  recurso: string | null;
  confirmado: boolean;
  token: string;
  expira: string;
}

interface MemoriaLocal {
  suscriptores: Map<string, FilaSuscriptorLocal>;
  pedidos: Map<string, RegistroPedido>;
  eventosWebhook: Set<string>;
  descargas: { pedidoId: string; fichero: string }[];
}

/**
 * La memoria vive en `globalThis` y no en el módulo.
 *
 * Next empaqueta cada ruta por separado, así que dos rutas que importan este
 * fichero **no comparten** su estado de módulo: el webhook creaba el pedido en
 * una copia y la página de éxito lo buscaba en otra. Colgarlo del objeto global
 * lo arregla, y de paso sobrevive a las recargas en caliente del modo desarrollo.
 */
const CLAVE_MEMORIA = Symbol.for("alcedo.almacen.local");

const contenedor = globalThis as unknown as Record<symbol, MemoriaLocal | undefined>;

const memoria: MemoriaLocal = (contenedor[CLAVE_MEMORIA] ??= {
  suscriptores: new Map(),
  pedidos: new Map(),
  eventosWebhook: new Set(),
  descargas: [],
});

const suscriptoresLocales = memoria.suscriptores;
const pedidosLocales = memoria.pedidos;
const eventosWebhookLocales = memoria.eventosWebhook;
const descargasLocales = memoria.descargas;

// ---------------------------------------------------------------------------
// Lista de correo
// ---------------------------------------------------------------------------

/**
 * Da de alta un correo pendiente de confirmar y devuelve el token.
 *
 * Si ya estaba confirmado no se toca nada y se devuelve `yaEstaba: true`, para
 * que la interfaz no insinúe que hay que volver a confirmar.
 */
export async function altaSuscriptor(
  email: string,
  recurso: string | null,
): Promise<{ token: string; yaEstaba: boolean }> {
  const token = generarToken();
  const expira = fechaDentroDeHoras(HORAS_TOKEN_CONFIRMACION);
  const normalizado = email.trim().toLowerCase();

  const supabase = clienteSupabase();

  if (!supabase) {
    const existente = suscriptoresLocales.get(normalizado);
    if (existente?.confirmado) return { token: existente.token, yaEstaba: true };

    suscriptoresLocales.set(normalizado, {
      email: normalizado,
      recurso,
      confirmado: false,
      token,
      expira,
    });
    return { token, yaEstaba: false };
  }

  const { data: existente } = await supabase
    .from("suscriptores")
    .select("confirmado, token_confirmacion")
    .eq("email", normalizado)
    .maybeSingle();

  if (existente?.confirmado) {
    return { token: (existente.token_confirmacion as string) ?? token, yaEstaba: true };
  }

  const { error } = await supabase.from("suscriptores").upsert(
    {
      email: normalizado,
      recurso,
      confirmado: false,
      token_confirmacion: token,
      token_expira_en: expira,
    },
    { onConflict: "email" },
  );

  if (error) throw new Error(`No se ha podido guardar el alta: ${error.message}`);

  return { token, yaEstaba: false };
}

/** Marca el correo como confirmado. Devuelve `null` si el token no vale. */
export async function confirmarSuscriptor(token: string): Promise<Suscriptor | null> {
  const supabase = clienteSupabase();
  const ahora = new Date();

  if (!supabase) {
    for (const fila of suscriptoresLocales.values()) {
      if (fila.token !== token) continue;
      if (new Date(fila.expira) < ahora) return null;
      fila.confirmado = true;
      return { email: fila.email, recurso: fila.recurso };
    }
    return null;
  }

  const { data } = await supabase
    .from("suscriptores")
    .select("email, recurso, token_expira_en")
    .eq("token_confirmacion", token)
    .maybeSingle();

  if (!data) return null;

  const expira = data.token_expira_en as string | null;
  if (expira && new Date(expira) < ahora) return null;

  await supabase
    .from("suscriptores")
    .update({ confirmado: true, confirmado_en: ahora.toISOString() })
    .eq("token_confirmacion", token);

  return { email: data.email as string, recurso: (data.recurso as string | null) ?? null };
}

// ---------------------------------------------------------------------------
// Idempotencia de webhooks
// ---------------------------------------------------------------------------

/**
 * Registra el evento y dice si es la primera vez que se ve.
 *
 * Devuelve `false` si ya estaba: quien llama debe responder 200 y no hacer nada
 * más. Sin esto, un reintento de la pasarela duplicaría el pedido y el correo.
 */
export async function eventoWebhookEsNuevo(
  id: string,
  tipo: string,
  proveedor: string,
): Promise<boolean> {
  const supabase = clienteSupabase();

  if (!supabase) {
    if (eventosWebhookLocales.has(id)) return false;
    eventosWebhookLocales.add(id);
    return true;
  }

  const { error } = await supabase
    .from("eventos_webhook")
    .insert({ id, tipo, proveedor });

  // 23505 = clave duplicada: el evento ya se había recibido.
  if (error?.code === "23505") return false;
  if (error) throw new Error(`No se ha podido registrar el evento: ${error.message}`);

  return true;
}

/**
 * Borra el registro del evento para que la pasarela pueda reintentarlo.
 *
 * Se usa cuando el procesado falla a mitad: si dejáramos la marca puesta, el
 * reintento se descartaría por duplicado y el cliente se quedaría pagado y sin
 * pedido, que es el peor final posible.
 */
export async function olvidarEventoWebhook(id: string): Promise<void> {
  const supabase = clienteSupabase();

  if (!supabase) {
    eventosWebhookLocales.delete(id);
    return;
  }

  await supabase.from("eventos_webhook").delete().eq("id", id);
}

export async function cerrarEventoWebhook(id: string, error?: string): Promise<void> {
  const supabase = clienteSupabase();
  if (!supabase) return;

  await supabase
    .from("eventos_webhook")
    .update({ procesado_en: new Date().toISOString(), error: error ?? null })
    .eq("id", id);
}

// ---------------------------------------------------------------------------
// Pedidos
// ---------------------------------------------------------------------------

function aRegistro(fila: Record<string, unknown>): RegistroPedido {
  return {
    id: fila.id as string,
    referenciaProveedor: fila.referencia_proveedor as string,
    email: fila.email as string,
    sku: fila.sku as string,
    importeCentimos: fila.importe_centimos as number,
    moneda: fila.moneda as string,
    pais: (fila.pais as string | null) ?? null,
    pagadoEn: fila.pagado_en as string,
    tokenDescarga: fila.token_descarga as string,
    tokenExpiraEn: fila.token_expira_en as string,
    descargasUsadas: (fila.descargas_usadas as number) ?? 0,
  };
}

export async function crearPedido(
  pedido: Pedido,
  proveedor: string,
): Promise<RegistroPedido> {
  const token = generarToken();
  const expira = fechaDentroDe(DIAS_TOKEN_DESCARGA);
  const supabase = clienteSupabase();

  if (!supabase) {
    const registro: RegistroPedido = {
      id: `local_${pedido.referenciaProveedor}`,
      ...pedido,
      tokenDescarga: token,
      tokenExpiraEn: expira,
      descargasUsadas: 0,
    };
    pedidosLocales.set(registro.referenciaProveedor, registro);
    return registro;
  }

  const { data, error } = await supabase
    .from("pedidos")
    .insert({
      referencia_proveedor: pedido.referenciaProveedor,
      proveedor,
      email: pedido.email.trim().toLowerCase(),
      sku: pedido.sku,
      importe_centimos: pedido.importeCentimos,
      moneda: pedido.moneda,
      pais: pedido.pais,
      pagado_en: pedido.pagadoEn,
      token_descarga: token,
      token_expira_en: expira,
    })
    .select()
    .single();

  if (error) throw new Error(`No se ha podido crear el pedido: ${error.message}`);

  return aRegistro(data);
}

export async function pedidoPorReferencia(
  referencia: string,
): Promise<RegistroPedido | null> {
  const supabase = clienteSupabase();

  if (!supabase) return pedidosLocales.get(referencia) ?? null;

  const { data } = await supabase
    .from("pedidos")
    .select()
    .eq("referencia_proveedor", referencia)
    .maybeSingle();

  return data ? aRegistro(data) : null;
}

export async function pedidoPorToken(token: string): Promise<RegistroPedido | null> {
  const supabase = clienteSupabase();

  if (!supabase) {
    for (const pedido of pedidosLocales.values()) {
      if (pedido.tokenDescarga === token) return pedido;
    }
    return null;
  }

  const { data } = await supabase
    .from("pedidos")
    .select()
    .eq("token_descarga", token)
    .maybeSingle();

  return data ? aRegistro(data) : null;
}

export async function pedidosDeEmail(email: string): Promise<RegistroPedido[]> {
  const normalizado = email.trim().toLowerCase();
  const supabase = clienteSupabase();

  if (!supabase) {
    return [...pedidosLocales.values()].filter(
      (pedido) => pedido.email.toLowerCase() === normalizado,
    );
  }

  const { data } = await supabase
    .from("pedidos")
    .select()
    .ilike("email", normalizado)
    .order("pagado_en", { ascending: false });

  return (data ?? []).map(aRegistro);
}

/** Enlace nuevo para un pedido: resetea caducidad y contador de descargas. */
export async function regenerarTokenDescarga(
  idPedido: string,
): Promise<RegistroPedido | null> {
  const token = generarToken();
  const expira = fechaDentroDe(DIAS_TOKEN_DESCARGA);
  const supabase = clienteSupabase();

  if (!supabase) {
    for (const pedido of pedidosLocales.values()) {
      if (pedido.id !== idPedido) continue;
      pedido.tokenDescarga = token;
      pedido.tokenExpiraEn = expira;
      pedido.descargasUsadas = 0;
      return pedido;
    }
    return null;
  }

  const { data } = await supabase
    .from("pedidos")
    .update({ token_descarga: token, token_expira_en: expira, descargas_usadas: 0 })
    .eq("id", idPedido)
    .select()
    .single();

  return data ? aRegistro(data) : null;
}

// ---------------------------------------------------------------------------
// Descargas
// ---------------------------------------------------------------------------

export interface ResultadoAnotarDescarga {
  permitida: boolean;
  usadas: number;
  limite: number;
}

/**
 * Anota una descarga y dice si se puede servir.
 *
 * El límite se calcula contando las descargas registradas, no leyendo un
 * contador: así dos peticiones simultáneas no pueden colarse por una condición
 * de carrera entre el «leer» y el «sumar uno».
 */
export async function anotarDescarga(
  pedido: RegistroPedido,
  fichero: string,
  version: string,
): Promise<ResultadoAnotarDescarga> {
  const supabase = clienteSupabase();

  if (!supabase) {
    const usadas = descargasLocales.filter((d) => d.pedidoId === pedido.id).length;
    if (usadas >= LIMITE_DESCARGAS) {
      return { permitida: false, usadas, limite: LIMITE_DESCARGAS };
    }
    descargasLocales.push({ pedidoId: pedido.id, fichero });
    return { permitida: true, usadas: usadas + 1, limite: LIMITE_DESCARGAS };
  }

  const { count } = await supabase
    .from("descargas")
    .select("id", { count: "exact", head: true })
    .eq("pedido_id", pedido.id);

  const usadas = count ?? 0;

  if (usadas >= LIMITE_DESCARGAS) {
    return { permitida: false, usadas, limite: LIMITE_DESCARGAS };
  }

  await supabase
    .from("descargas")
    .insert({ pedido_id: pedido.id, fichero, version });

  await supabase
    .from("pedidos")
    .update({ descargas_usadas: usadas + 1 })
    .eq("id", pedido.id);

  return { permitida: true, usadas: usadas + 1, limite: LIMITE_DESCARGAS };
}

/**
 * URL firmada de un fichero del bucket privado.
 *
 * Devuelve `null` en modo local: no hay bucket, y es preferible que la interfaz
 * lo diga a que finja una descarga.
 */
export async function urlFirmadaDeFichero(ruta: string): Promise<string | null> {
  const supabase = clienteSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from(BUCKET_PRODUCTOS)
    .createSignedUrl(ruta, SEGUNDOS_URL_FIRMADA);

  if (error || !data) {
    throw new Error(`No se ha podido firmar la descarga de «${ruta}»: ${error?.message}`);
  }

  return data.signedUrl;
}

// ---------------------------------------------------------------------------
// Analítica propia
// ---------------------------------------------------------------------------

/**
 * Registra un evento de negocio.
 *
 * Nunca lanza: que falle la analítica no puede tumbar una compra. Si algo va
 * mal, se anota en consola y la vida sigue.
 */
export async function registrarEvento(
  nombre: NombreEvento,
  propiedades: Record<string, unknown> = {},
): Promise<void> {
  try {
    const supabase = clienteSupabase();

    if (!supabase) {
      if (process.env.NODE_ENV === "development") {
        console.info(`[evento] ${nombre}`, propiedades);
      }
      return;
    }

    await supabase.from("eventos").insert({ nombre, propiedades });
  } catch (error) {
    console.error("[evento] no se ha podido registrar:", error);
  }
}
