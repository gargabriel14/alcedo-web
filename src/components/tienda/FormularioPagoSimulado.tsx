"use client";

import { useActionState, useId } from "react";
import { Boton } from "@/components/ui/Boton";
import { completarPagoSimulado, ESTADO_COMPRA_INICIAL } from "@/lib/tienda/acciones";

/**
 * Formulario del pago simulado.
 *
 * Pide el correo porque es lo que pediría la pasarela de verdad: el pedido y la
 * entrega van asociados a él. Al enviar, se dispara nuestro propio webhook con
 * la cabecera de simulación, de modo que se recorre exactamente el mismo camino
 * que en producción.
 */
export function FormularioPagoSimulado({
  sku,
  referencia,
  emailInicial,
}: {
  sku: string;
  referencia: string;
  emailInicial?: string;
}) {
  const [estado, accion, pendiente] = useActionState(
    completarPagoSimulado,
    ESTADO_COMPRA_INICIAL,
  );
  const idCampo = useId();

  return (
    <form action={accion} className="mt-6">
      <input type="hidden" name="sku" value={sku} />
      <input type="hidden" name="referencia" value={referencia} />

      <label htmlFor={idCampo} className="block text-sm font-medium text-texto">
        Correo del comprador
      </label>
      <input
        id={idCampo}
        name="email"
        type="email"
        required
        defaultValue={emailInicial}
        autoComplete="email"
        placeholder="prueba@ejemplo.com"
        className="mt-2 h-11 w-full rounded-md border border-borde-fuerte bg-fondo px-3.5 text-[0.9375rem] text-texto placeholder:text-texto-tenue/70"
      />

      <Boton type="submit" tamano="lg" completo disabled={pendiente} className="mt-4">
        {pendiente ? "Procesando…" : "Simular pago completado"}
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
