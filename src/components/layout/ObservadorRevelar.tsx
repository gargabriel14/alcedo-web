"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * El único JavaScript de las animaciones de entrada.
 *
 * Se monta una vez en el layout, busca en el documento todo lo que lleve la clase
 * `revelar` y lo observa con un solo `IntersectionObserver`, que además deja de
 * observar cada elemento en cuanto aparece. No queda nada escuchando el scroll.
 *
 * Se vuelve a pasar al cambiar de ruta, porque en una navegación de cliente el
 * contenido nuevo entra sin recargar la página.
 *
 * Sin `IntersectionObserver` —o con `prefers-reduced-motion`, que lo neutraliza
 * en CSS— todo queda visible desde el principio: la animación es un adorno y
 * jamás puede esconder contenido.
 */
export function ObservadorRevelar() {
  const ruta = usePathname();

  useEffect(() => {
    const pendientes = document.querySelectorAll<HTMLElement>(
      ".revelar:not([data-visible])",
    );

    if (pendientes.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      for (const elemento of pendientes) elemento.dataset.visible = "true";
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          (entrada.target as HTMLElement).dataset.visible = "true";
          observador.unobserve(entrada.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    for (const elemento of pendientes) observador.observe(elemento);

    return () => observador.disconnect();
  }, [ruta]);

  return null;
}
