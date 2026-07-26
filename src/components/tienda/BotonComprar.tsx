"use client";

import { useActionState } from "react";
import { Boton } from "@/components/ui/Boton";
import { ESTADO_COMPRA_INICIAL, iniciarCompra } from "@/lib/tienda/acciones";

/**
 * Botón que abre el pago.
 *
 * Solo manda el SKU. El precio lo pone el servidor a partir del catálogo, así
 * que manipular este formulario no sirve de nada.
 */
export function BotonComprar({
  sku,
  children,
  completo = true,
}: {
  sku: string;
  children: React.ReactNode;
  completo?: boolean;
}) {
  const [estado, accion, pendiente] = useActionState(iniciarCompra, ESTADO_COMPRA_INICIAL);

  return (
    <form action={accion}>
      <input type="hidden" name="sku" value={sku} />

      <Boton type="submit" tamano="lg" completo={completo} disabled={pendiente}>
        {pendiente ? "Abriendo el pago…" : children}
      </Boton>

      <p aria-live="polite">
        {estado.estado === "error" ? (
          <span className="mt-2 block text-sm font-medium text-sello-labs-texto">
            {estado.mensaje}
          </span>
        ) : null}
      </p>
    </form>
  );
}
