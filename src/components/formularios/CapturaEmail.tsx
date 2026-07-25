"use client";

import Link from "next/link";
import { useActionState, useId } from "react";
import { Boton } from "@/components/ui/Boton";
import {
  altaEnBoletin,
  ESTADO_ALTA_INICIAL,
} from "@/lib/boletin/acciones";
import type { Recurso } from "@/lib/datos/recursos";
import { cn } from "@/lib/utils";

interface PropsCapturaEmail {
  recurso: Recurso;
  /** `hero` para la portada; `insertada` para mitad de artículo (Fase 2). */
  variante?: "hero" | "insertada";
  /** Texto del botón. Que prometa el entregable, no la acción. */
  textoBoton?: string;
  className?: string;
}

/**
 * Captura de correo a cambio de un entregable concreto.
 *
 * Decisiones de conversión, no de estética:
 * - Un solo campo. Cada campo extra que se añade se lleva un porcentaje de altas.
 * - El botón nombra el premio («Quiero la plantilla»), no la mecánica («Enviar»).
 * - El aviso de RGPD va debajo y en pequeño, pero está: sin él no se puede tratar
 *   el dato, y además baja la desconfianza al decir que no hay spam.
 * - `type="email"` + `inputMode` para que el móvil saque el teclado correcto.
 */
export function CapturaEmail({
  recurso,
  variante = "hero",
  textoBoton = "Quiero la plantilla",
  className,
}: PropsCapturaEmail) {
  const [estado, accion, pendiente] = useActionState(altaEnBoletin, ESTADO_ALTA_INICIAL);
  const idCampo = useId();
  const idAyuda = `${idCampo}-ayuda`;

  if (estado.estado === "ok") {
    return (
      <div
        className={cn(
          "rounded-lg border border-marca/35 bg-marca-suave p-5",
          className,
        )}
        role="status"
      >
        <p className="font-titulares text-lg font-semibold text-texto">
          Apuntado: {estado.email}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-texto-tenue">
          Formulario validado correctamente.{" "}
          <strong className="font-semibold text-texto">
            Pendiente de conectar (Fase 3):
          </strong>{" "}
          todavía no se guarda el dato ni se envía el correo con la plantilla. En
          cuanto Supabase y Resend estén enchufados, este mismo formulario mandará
          el email de confirmación y, al confirmar, el fichero.
        </p>
      </div>
    );
  }

  return (
    <form
      action={accion}
      className={cn(
        variante === "hero" &&
          "rounded-lg border border-borde bg-superficie p-5 shadow-tarjeta sm:p-6",
        variante === "insertada" && "rounded-lg border-l-4 border-marca bg-superficie-tenue p-5",
        className,
      )}
    >
      <input type="hidden" name="recurso" value={recurso.slug} />

      {/* Trampa para bots. Fuera de pantalla, no oculta con `display:none`,
          para que los rellenadores automáticos la vean y la marquen. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor={`${idCampo}-web`}>No rellenar</label>
        <input id={`${idCampo}-web`} name="web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="ojo-titular">Descarga gratuita</p>
      <p className="mt-2 font-titulares text-xl leading-snug font-semibold text-texto sm:text-2xl">
        {recurso.titulo}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-texto-tenue">{recurso.gancho}</p>

      <ul className="mt-3.5 flex flex-wrap gap-1.5">
        {recurso.formatos.map((formato) => (
          <li
            key={formato}
            className="rounded-full border border-borde bg-fondo px-2.5 py-1 text-xs font-medium text-texto-tenue"
          >
            {formato}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <div className="flex-1">
          <label htmlFor={idCampo} className="sr-only">
            Tu correo electrónico
          </label>
          <input
            id={idCampo}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="tu@correo.com"
            aria-describedby={idAyuda}
            aria-invalid={estado.estado === "error" ? true : undefined}
            className="h-11 w-full rounded-md border border-borde-fuerte bg-fondo px-3.5 text-[0.9375rem] text-texto placeholder:text-texto-tenue/70"
          />
        </div>
        <Boton type="submit" tamano="md" disabled={pendiente} className="sm:w-auto">
          {pendiente ? "Enviando…" : textoBoton}
        </Boton>
      </div>

      <p aria-live="polite" className="min-h-0">
        {estado.estado === "error" ? (
          <span className="mt-2 block text-sm font-medium text-sello-labs-texto">
            {estado.mensaje}
          </span>
        ) : null}
      </p>

      <p id={idAyuda} className="mt-3 text-xs leading-relaxed text-texto-tenue">
        Te enviamos un correo para confirmar y, con él, la plantilla. Nada de spam:
        escribimos cuando publicamos algo o actualizamos un libro que tengas. Puedes
        darte de baja en un clic.{" "}
        <Link href="/legal/privacidad" className="underline hover:text-marca-texto">
          Cómo tratamos tus datos
        </Link>
        .
      </p>
    </form>
  );
}
