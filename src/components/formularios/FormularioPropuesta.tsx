"use client";

import { useActionState, useId } from "react";
import { Boton } from "@/components/ui/Boton";
import { proponerLibro } from "@/lib/autores/acciones";
import { ESTADO_PROPUESTA_INICIAL } from "@/lib/autores/estado";

const CLASES_CAMPO =
  "mt-2 w-full rounded-md border border-borde-fuerte bg-fondo px-3.5 py-2.5 text-[0.9375rem] text-texto placeholder:text-texto-tenue/70";

export function FormularioPropuesta() {
  const [estado, accion, pendiente] = useActionState(
    proponerLibro,
    ESTADO_PROPUESTA_INICIAL,
  );
  const id = useId();

  if (estado.estado === "ok") {
    return (
      <div className="rounded-lg border border-marca/35 bg-marca-suave p-6" role="status">
        <p className="font-titulares text-xl font-semibold text-texto">
          Recibido, {estado.nombre}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-texto-tenue">
          Lo leemos entero, siempre. Si encaja, te escribimos en menos de dos semanas
          para hablar del enfoque. Si no encaja, también te contestamos: un «no» rápido
          vale más que un silencio.
        </p>
      </div>
    );
  }

  return (
    <form action={accion} className="rounded-lg border border-borde bg-superficie p-6">
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor={`${id}-web`}>No rellenar</label>
        <input id={`${id}-web`} name="web" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor={`${id}-nombre`} className="text-sm font-medium text-texto">
          Cómo te llamas
        </label>
        <input
          id={`${id}-nombre`}
          name="nombre"
          required
          autoComplete="name"
          className={CLASES_CAMPO}
        />
      </div>

      <div className="mt-5">
        <label htmlFor={`${id}-email`} className="text-sm font-medium text-texto">
          Tu correo
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          className={CLASES_CAMPO}
        />
      </div>

      <div className="mt-5">
        <label htmlFor={`${id}-tema`} className="text-sm font-medium text-texto">
          Sobre qué quieres escribir
        </label>
        <p className="mt-1 text-xs text-texto-tenue">
          En una o dos frases, y a ser posible con el resultado dentro: «enseñar a un
          fontanero autónomo a presupuestar sin perder dinero».
        </p>
        <textarea
          id={`${id}-tema`}
          name="tema"
          required
          rows={3}
          className={CLASES_CAMPO}
        />
      </div>

      <div className="mt-5">
        <label htmlFor={`${id}-experiencia`} className="text-sm font-medium text-texto">
          Qué has resuelto tú de esto
        </label>
        <p className="mt-1 text-xs text-texto-tenue">
          No buscamos títulos: buscamos que lo hayas hecho y se lo hayas explicado ya a
          alguien. Vale un taller, un blog, un grupo de clientes o tu propio negocio.
        </p>
        <textarea
          id={`${id}-experiencia`}
          name="experiencia"
          required
          rows={4}
          className={CLASES_CAMPO}
        />
      </div>

      <Boton type="submit" tamano="lg" completo disabled={pendiente} className="mt-6">
        {pendiente ? "Enviando…" : "Enviar la propuesta"}
      </Boton>

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
