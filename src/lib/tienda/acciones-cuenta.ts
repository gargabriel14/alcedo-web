"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { urlAbsoluta } from "@/lib/sitio";
import { pedidosDeEmail, regenerarTokenDescarga } from "@/lib/tienda/almacen";
import type { EstadoAcceso } from "@/lib/tienda/estados";
import { clienteConSesion, emailDeLaSesion } from "@/lib/tienda/sesion";

const esquemaEmail = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ message: "Ese correo no parece válido." }));

/**
 * Manda el enlace mágico de acceso.
 *
 * Responde lo mismo exista o no una cuenta con ese correo. Si dijéramos «ese
 * correo no ha comprado nada», cualquiera podría averiguar quién es cliente
 * probando direcciones.
 */
export async function enviarEnlaceMagico(
  _estadoPrevio: EstadoAcceso,
  datos: FormData,
): Promise<EstadoAcceso> {
  const resultado = esquemaEmail.safeParse(datos.get("email"));

  if (!resultado.success) {
    return { estado: "error", mensaje: "Ese correo no parece válido." };
  }

  const email = resultado.data;
  const supabase = await clienteConSesion();

  if (!supabase) {
    return {
      estado: "error",
      mensaje:
        "El acceso por enlace mágico necesita Supabase configurado. En modo local no se puede entrar.",
    };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: urlAbsoluta("/cuenta/callback") },
  });

  if (error) {
    console.error("[cuenta] no se ha podido mandar el enlace:", error.message);
    return {
      estado: "error",
      mensaje: "No hemos podido mandar el enlace. Inténtalo de nuevo en un minuto.",
    };
  }

  return { estado: "enviado", email };
}

export async function cerrarSesion(): Promise<void> {
  const supabase = await clienteConSesion();
  if (supabase) await supabase.auth.signOut();
  redirect("/cuenta");
}

/**
 * Genera un enlace de descarga nuevo para un pedido.
 *
 * Comprueba que el pedido sea de quien lo pide: sin esto, cambiar el id en el
 * formulario daría acceso a las descargas de otro comprador.
 */
export async function regenerarDescargas(datos: FormData): Promise<void> {
  const idPedido = datos.get("pedido");
  if (typeof idPedido !== "string") return;

  const email = await emailDeLaSesion();
  if (!email) redirect("/cuenta");

  const suyos = await pedidosDeEmail(email);
  if (!suyos.some((pedido) => pedido.id === idPedido)) return;

  await regenerarTokenDescarga(idPedido);
  revalidatePath("/cuenta");
}
