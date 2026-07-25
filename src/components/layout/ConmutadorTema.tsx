"use client";

import { useEffect } from "react";
import { CLAVE_TEMA } from "@/components/layout/ScriptTema";
import { cn } from "@/lib/utils";

function consultaSistema(): MediaQueryList {
  return window.matchMedia("(prefers-color-scheme: dark)");
}

/**
 * Conmutador manual de tema.
 *
 * Los dos iconos están siempre en el DOM y se muestran con la variante `oscuro:`
 * de CSS. Así el botón ya sale correcto en el HTML estático, sin desajuste de
 * hidratación y sin esperar a que arranque JavaScript.
 *
 * Si la elección coincide con la del sistema se borra la preferencia guardada:
 * el sitio vuelve a seguir al sistema si el usuario cambia el tema del móvil.
 */
export function ConmutadorTema({ className }: { className?: string }) {
  useEffect(() => {
    const consulta = consultaSistema();

    function alCambiarSistema(evento: MediaQueryListEvent) {
      try {
        if (localStorage.getItem(CLAVE_TEMA)) return;
      } catch {
        // Almacenamiento bloqueado: seguimos al sistema, que es lo que toca.
      }
      document.documentElement.classList.toggle("oscuro", evento.matches);
    }

    consulta.addEventListener("change", alCambiarSistema);
    return () => consulta.removeEventListener("change", alCambiarSistema);
  }, []);

  function alternar() {
    const raiz = document.documentElement;
    const seraOscuro = !raiz.classList.contains("oscuro");
    raiz.classList.toggle("oscuro", seraOscuro);

    try {
      if (seraOscuro === consultaSistema().matches) {
        localStorage.removeItem(CLAVE_TEMA);
      } else {
        localStorage.setItem(CLAVE_TEMA, seraOscuro ? "oscuro" : "claro");
      }
    } catch {
      // Sin almacenamiento el cambio dura solo esta página. Aceptable.
    }
  }

  return (
    <button
      type="button"
      onClick={alternar}
      title="Cambiar entre modo claro y oscuro"
      aria-label="Cambiar entre modo claro y oscuro"
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-md text-texto-tenue transition-colors hover:bg-superficie-tenue hover:text-texto",
        className,
      )}
    >
      {/* Sol: visible en claro. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        className="size-[1.15rem] oscuro:hidden"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.6v2.2M12 19.2v2.2M4.4 12H2.2M21.8 12h-2.2M6.6 6.6 5 5M19 19l-1.6-1.6M6.6 17.4 5 19M19 5l-1.6 1.6" />
      </svg>
      {/* Luna: visible en oscuro. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hidden size-[1.15rem] oscuro:block"
      >
        <path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1Z" />
      </svg>
    </button>
  );
}
