"use client";

import { useActionState, useId } from "react";
import { Boton } from "@/components/ui/Boton";
import { enviarEnlaceMagico } from "@/lib/tienda/acciones-cuenta";
import { ESTADO_ACCESO_INICIAL } from "@/lib/tienda/estados";

/**
 * Acceso al área de cliente por enlace mágico.
 *
 * Sin contraseña: se manda un enlace al correo de la compra. Para una tienda de
 * productos digitales es menos fricción y una responsabilidad menos.
 */
export function FormularioAcceso() {
  const [estado, accion, pendiente] = useActionState(
    enviarEnlaceMagico,
    ESTADO_ACCESO_INICIAL,
  );
  const idCampo = useId();

  if (estado.estado === "enviado") {
    return (
      <div
        className="rounded-lg border border-marca/35 bg-marca-suave p-5"
        role="status"
      >
        <p className="font-titulares text-lg font-semibold text-texto">
          Mira tu correo
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-texto-tenue">
          Si <strong className="text-texto">{estado.email}</strong> tiene compras con
          nosotros, ahí encontrarás un enlace para entrar. Caduca en una hora y solo
          sirve una vez.
        </p>
      </div>
    );
  }

  return (
    <form action={accion} className="rounded-lg border border-borde bg-superficie p-5 sm:p-6">
      <label htmlFor={idCampo} className="block text-sm font-medium text-texto">
        El correo con el que compraste
      </label>
      <p className="mt-1 text-sm text-texto-tenue">
        Te mandamos un enlace para entrar. No hace falta contraseña.
      </p>

      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <input
          id={idCampo}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="tu@correo.com"
          className="h-11 flex-1 rounded-md border border-borde-fuerte bg-fondo px-3.5 text-[0.9375rem] text-texto placeholder:text-texto-tenue/70"
        />
        <Boton type="submit" disabled={pendiente}>
          {pendiente ? "Enviando…" : "Enviarme el enlace"}
        </Boton>
      </div>

      <p aria-live="polite">
        {estado.estado === "error" ? (
          <span className="mt-3 block text-sm font-medium text-sello-labs-texto">
            {estado.mensaje}
          </span>
        ) : null}
      </p>
    </form>
  );
}
