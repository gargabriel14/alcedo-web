import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Sesión del cliente en el área de cuenta.
 *
 * Usa la **clave pública** y las cookies de Supabase Auth, no la clave de
 * servicio: aquí el que manda es el usuario identificado, y las políticas RLS
 * son las que le impiden ver pedidos ajenos.
 *
 * El acceso es por enlace mágico al correo. No hay contraseñas que guardar, que
 * recordar, ni que filtrar: para una tienda de productos digitales es menos
 * fricción para el comprador y menos responsabilidad para nosotros.
 */

export function hayAuthConfigurada(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function clienteConSesion(): Promise<SupabaseClient | null> {
  if (!hayAuthConfigurada()) return null;

  const almacenCookies = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return almacenCookies.getAll();
        },
        setAll(nuevas) {
          try {
            for (const { name, value, options } of nuevas) {
              almacenCookies.set(name, value, options);
            }
          } catch {
            // Los componentes de servidor no pueden escribir cookies. Lo hace el
            // callback de autenticación, que sí es un route handler.
          }
        },
      },
    },
  );
}

/** Correo de quien está identificado, o `null`. */
export async function emailDeLaSesion(): Promise<string | null> {
  const supabase = await clienteConSesion();
  if (!supabase) return null;

  const { data } = await supabase.auth.getUser();
  return data.user?.email ?? null;
}
