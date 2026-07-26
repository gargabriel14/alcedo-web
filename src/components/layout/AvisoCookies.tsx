"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Boton } from "@/components/ui/Boton";

const COOKIE = "alcedo-aviso-cookies";
const DIAS = 180;

/**
 * Aviso de cookies.
 *
 * Este sitio **no instala ninguna cookie no esencial**: la analítica de Vercel
 * funciona sin cookies y no hay píxeles de redes ni publicidad. Por eso el aviso
 * es informativo y tiene un solo botón: no hay nada que rechazar, y montar un
 * falso «aceptar / rechazar» cuando no hay seguimiento sería teatro.
 *
 * El día que se añada algo que sí requiera consentimiento, este componente es el
 * sitio donde condicionarlo: se lee la cookie antes de cargar nada.
 */
/** La cookie es un sistema externo a React: se lee con `useSyncExternalStore`. */
function suscribir(): () => void {
  // Nadie más cambia esta cookie mientras la página está abierta.
  return () => {};
}

function leerCookie(): "aceptado" | "pendiente" {
  return document.cookie.split("; ").some((trozo) => trozo.startsWith(`${COOKIE}=`))
    ? "aceptado"
    : "pendiente";
}

export function AvisoCookies() {
  // En el servidor se considera aceptado para que el HTML estático no incluya el
  // aviso: aparece al hidratar solo si de verdad hace falta.
  const estado = useSyncExternalStore(suscribir, leerCookie, () => "aceptado" as const);
  const [ocultado, setOcultado] = useState(false);

  function aceptar() {
    const caducidad = new Date(Date.now() + DIAS * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${COOKIE}=1; expires=${caducidad}; path=/; SameSite=Lax`;
    setOcultado(true);
  }

  if (estado === "aceptado" || ocultado) return null;

  return (
    <div
      role="region"
      aria-label="Aviso sobre cookies"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-borde bg-fondo/97 pb-[max(0.9rem,env(safe-area-inset-bottom))] backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 px-5 pt-4 sm:flex-row sm:items-center sm:gap-6">
        <p className="flex-1 text-sm leading-relaxed text-texto-tenue">
          Este sitio <strong className="text-texto">no usa cookies de seguimiento ni
          publicidad</strong>. Solo lo imprescindible: tu preferencia de tema y, si
          entras en tu cuenta, la sesión.{" "}
          <Link href="/legal/cookies" className="underline hover:text-marca-texto">
            Más detalle
          </Link>
          .
        </p>

        <Boton onClick={aceptar} tamano="sm" className="shrink-0">
          Entendido
        </Boton>
      </div>
    </div>
  );
}
