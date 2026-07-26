"use client";

import { clasesBoton, type VarianteBoton } from "@/components/ui/Boton";

/**
 * Enlace a Amazon con registro del clic.
 *
 * Amazon es el canal de captación y hay que saber cuánto tráfico se le manda:
 * si un libro vende mucho en Amazon y poco aquí, el problema está en la ficha,
 * no en el libro.
 *
 * Usa `sendBeacon`, que entrega el aviso aunque la página se esté cerrando, y no
 * retrasa la navegación ni un milisegundo. Si falla, no pasa nada: la analítica
 * nunca puede estorbar a una venta.
 */
export function EnlaceAmazon({
  href,
  sku,
  formato,
  variante = "secundario",
  children,
}: {
  href: string;
  sku: string;
  formato: "kindle" | "tapa-blanda";
  variante?: VarianteBoton;
  children: React.ReactNode;
}) {
  function alPulsar() {
    try {
      const cuerpo = JSON.stringify({
        nombre: "click_amazon",
        propiedades: { sku, formato },
      });
      navigator.sendBeacon?.("/api/eventos", new Blob([cuerpo], { type: "application/json" }));
    } catch {
      // Si la analítica falla, el enlace sigue funcionando. Es lo único que importa.
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={alPulsar}
      className={clasesBoton(variante, "md", "w-full")}
    >
      {children}
    </a>
  );
}
