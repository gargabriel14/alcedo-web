import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para el servidor.
 *
 * Usa la **clave de servicio**, que se salta las políticas RLS. Por eso este
 * módulo lleva `server-only`: si alguien lo importara desde un componente de
 * cliente, el build fallaría en vez de publicar la clave en el navegador.
 *
 * Si faltan las variables, no se lanza nada: la aplicación entra en «modo local»
 * (ver `almacen.ts`) y se puede seguir desarrollando. Lo que no se hace nunca es
 * fingir que se guardó algo cuando no había dónde guardarlo.
 */

let cliente: SupabaseClient | null = null;

export function hayCredencialesSupabase(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function clienteSupabase(): SupabaseClient | null {
  if (cliente) return cliente;
  if (!hayCredencialesSupabase()) return null;

  cliente = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );

  return cliente;
}

/** Bucket privado donde viven los ficheros que se venden. */
export const BUCKET_PRODUCTOS = "productos";
