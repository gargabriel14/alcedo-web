"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useState } from "react";

interface Muestra {
  src: string;
  alt: string;
  ancho: number;
  alto: number;
}

/**
 * Visor de las páginas de muestra.
 *
 * Radix Dialog para el foco y el `Esc`; las flechas del teclado pasan de página.
 * Las miniaturas son `next/image` con `sizes` ajustado, así que en móvil se
 * descargan miniaturas y no las páginas completas.
 */
export function VisorMuestras({
  muestras,
  titulo,
}: {
  muestras: readonly Muestra[];
  titulo: string;
}) {
  const [abierta, setAbierta] = useState<number | null>(null);
  const actual = abierta === null ? null : muestras[abierta];

  function mover(delta: number) {
    setAbierta((anterior) => {
      if (anterior === null) return anterior;
      const siguiente = (anterior + delta + muestras.length) % muestras.length;
      return siguiente;
    });
  }

  return (
    <>
      <ul className="mt-6 grid grid-cols-3 gap-4">
        {muestras.map((muestra, indice) => (
          <li key={muestra.src}>
            <button
              type="button"
              onClick={() => setAbierta(indice)}
              className="group block w-full overflow-hidden rounded-sm border border-borde bg-white shadow-tarjeta"
            >
              <span className="relative block aspect-[3/4]">
                <Image
                  src={muestra.src}
                  alt={muestra.alt}
                  fill
                  sizes="(min-width: 640px) 15rem, 30vw"
                  className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                />
              </span>
              <span className="sr-only">Ampliar página de muestra {indice + 1}</span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root
        open={abierta !== null}
        onOpenChange={(estaAbierta) => {
          if (!estaAbierta) setAbierta(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-tinta/80 data-[state=open]:animate-[aparecer_150ms_ease-out]" />
          <Dialog.Content
            onKeyDown={(evento) => {
              if (evento.key === "ArrowRight") mover(1);
              if (evento.key === "ArrowLeft") mover(-1);
            }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-8"
          >
            <Dialog.Title className="sr-only">
              Páginas de muestra de {titulo}
            </Dialog.Title>

            {actual ? (
              <Image
                src={actual.src}
                alt={actual.alt}
                width={actual.ancho}
                height={actual.alto}
                sizes="(min-width: 1024px) 60rem, 92vw"
                className="max-h-[80vh] w-auto rounded-sm bg-white object-contain shadow-2xl"
              />
            ) : null}

            <div className="mt-4 flex items-center gap-2">
              <BotonVisor etiqueta="Página anterior" onClick={() => mover(-1)}>
                ←
              </BotonVisor>
              <span className="min-w-20 text-center text-sm text-hueso/80">
                {(abierta ?? 0) + 1} de {muestras.length}
              </span>
              <BotonVisor etiqueta="Página siguiente" onClick={() => mover(1)}>
                →
              </BotonVisor>
            </div>

            <Dialog.Close
              aria-label="Cerrar el visor"
              className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-md bg-tinta/60 text-hueso hover:bg-tinta"
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
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function BotonVisor({
  etiqueta,
  onClick,
  children,
}: {
  etiqueta: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiqueta}
      className="inline-flex size-11 items-center justify-center rounded-md bg-tinta/60 text-lg text-hueso hover:bg-tinta"
    >
      <span aria-hidden="true">{children}</span>
    </button>
  );
}
