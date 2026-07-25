"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { Logo } from "@/components/marca/Logo";
import {
  NAVEGACION_EDITORIAL,
  NAVEGACION_PRINCIPAL,
  type EnlaceNavegacion,
} from "@/lib/sitio";

/**
 * Menú de navegación en móvil.
 *
 * Es el único sitio donde tiramos de Radix: un cajón hecho a mano se olvida del
 * foco atrapado, de `Esc`, de bloquear el scroll del fondo y de los `aria-*`.
 * Son ~10 kB por accesibilidad AA de verdad en el 75 % del tráfico.
 */
export function MenuMovil() {
  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label="Abrir el menú de navegación"
        className="inline-flex size-10 items-center justify-center rounded-md text-texto transition-colors hover:bg-superficie-tenue md:hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="size-5"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-tinta/45 backdrop-blur-[2px] data-[state=closed]:animate-[desvanecer_150ms_ease-in_forwards] data-[state=open]:animate-[aparecer_180ms_ease-out]" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(21rem,88vw)] flex-col overflow-y-auto border-l border-borde bg-fondo shadow-2xl data-[state=closed]:animate-[salir-derecha_180ms_ease-in_forwards] data-[state=open]:animate-[entrar-derecha_220ms_ease-out]">
          <Dialog.Title className="sr-only">Menú de navegación</Dialog.Title>

          <div className="flex items-center justify-between border-b border-borde px-5 py-3.5">
            <Dialog.Close asChild>
              <Link href="/" aria-label="Editorial Alcedo, ir a la portada">
                <Logo />
              </Link>
            </Dialog.Close>
            <Dialog.Close
              aria-label="Cerrar el menú"
              className="inline-flex size-10 items-center justify-center rounded-md text-texto-tenue transition-colors hover:bg-superficie-tenue hover:text-texto"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="size-5"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </Dialog.Close>
          </div>

          <nav className="flex flex-col px-2 py-3">
            {NAVEGACION_PRINCIPAL.map((enlace) => (
              <EnlaceMenu key={enlace.ruta} enlace={enlace} />
            ))}
          </nav>

          <div className="mt-auto border-t border-borde px-5 py-5">
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-texto-tenue">
              {NAVEGACION_EDITORIAL.map((enlace) => (
                <li key={enlace.ruta}>
                  <Dialog.Close asChild>
                    <Link href={enlace.ruta} className="hover:text-marca-texto">
                      {enlace.nombre}
                    </Link>
                  </Dialog.Close>
                </li>
              ))}
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function EnlaceMenu({ enlace }: { enlace: EnlaceNavegacion }) {
  return (
    <Dialog.Close asChild>
      <Link
        href={enlace.ruta}
        className="rounded-md px-3 py-3 transition-colors hover:bg-superficie-tenue"
      >
        <span className="block font-titulares text-lg font-semibold text-texto">
          {enlace.nombre}
        </span>
        {enlace.pista ? (
          <span className="mt-0.5 block text-sm text-texto-tenue">{enlace.pista}</span>
        ) : null}
      </Link>
    </Dialog.Close>
  );
}
