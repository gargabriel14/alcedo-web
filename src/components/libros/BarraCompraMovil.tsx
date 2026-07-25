"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Barra de compra pegajosa en móvil.
 *
 * Aparece cuando la tarjeta del PDF Premium se ha ido por arriba de la pantalla,
 * es decir, cuando el lector ya ha visto el precio y sigue bajando. Es el patrón
 * que más sube la conversión en móvil, y aquí cuesta un `IntersectionObserver`:
 * ni escuchamos el evento de scroll ni recalculamos posiciones en cada píxel.
 *
 * En escritorio no se monta: la tarjeta de compra queda siempre a la vista.
 */
export function BarraCompraMovil({
  sku,
  titulo,
  precio,
}: {
  sku: string;
  titulo: string;
  precio: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const objetivo = document.getElementById("tarjeta-pdf");
    if (!objetivo) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        const entrada = entradas[0];
        if (!entrada) return;
        // Solo si se fue por arriba: al llegar al pie no molestamos.
        setVisible(!entrada.isIntersecting && entrada.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );

    observador.observe(objetivo);
    return () => observador.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-borde bg-fondo/95 pb-[max(0.7rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 pt-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-texto-tenue">{titulo}</p>
          <p className="text-[0.9375rem] font-semibold text-texto">
            PDF Premium {precio}
          </p>
        </div>
        <Link
          href={`/comprar/${sku}`}
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-marca px-5 text-[0.9375rem] font-medium text-marca-contraste shadow-sm"
        >
          Comprar
        </Link>
      </div>
    </div>
  );
}
