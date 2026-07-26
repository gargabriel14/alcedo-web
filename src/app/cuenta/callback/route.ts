import { NextResponse } from "next/server";
import { clienteConSesion } from "@/lib/tienda/sesion";

/**
 * Vuelta del enlace mágico.
 *
 * Supabase manda aquí con un `code` de un solo uso que se canjea por la sesión.
 * Es un route handler y no una página porque hay que **escribir cookies**, y eso
 * un componente de servidor no puede hacerlo.
 */
export async function GET(peticion: Request): Promise<Response> {
  const url = new URL(peticion.url);
  const codigo = url.searchParams.get("code");

  if (!codigo) {
    return NextResponse.redirect(new URL("/cuenta?error=sin-codigo", url.origin));
  }

  const supabase = await clienteConSesion();

  if (!supabase) {
    return NextResponse.redirect(new URL("/cuenta?error=sin-configurar", url.origin));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(codigo);

  if (error) {
    console.error("[cuenta] no se ha podido canjear el código:", error.message);
    return NextResponse.redirect(new URL("/cuenta?error=enlace-caducado", url.origin));
  }

  return NextResponse.redirect(new URL("/cuenta", url.origin));
}
