import { Fragment } from "react";

/**
 * Cinta de titulares que desfila.
 *
 * Anima `transform` sobre una pista duplicada, así que el bucle es continuo y el
 * navegador no repinta nada: sube al hilo del compositor y no toca el principal.
 * Se detiene al pasar el cursor por encima —para poder leerla— y no se mueve con
 * `prefers-reduced-motion`.
 *
 * Va marcada como decorativa y el mismo texto se ofrece para lectores de pantalla
 * en un párrafo aparte: una marquesina es ilegible con voz.
 */
export function Cinta({ mensajes }: { mensajes: readonly string[] }) {
  const pista = (
    <p className="flex shrink-0 items-center gap-9 px-4 py-3.5 text-[0.65rem] font-semibold tracking-[0.26em] whitespace-nowrap text-texto-tenue uppercase">
      {mensajes.map((mensaje) => (
        <Fragment key={mensaje}>
          <span>{mensaje}</span>
          <span className="text-marca">✦</span>
        </Fragment>
      ))}
    </p>
  );

  return (
    <div className="cinta overflow-hidden border-y border-borde bg-superficie">
      <div className="cinta-pista" aria-hidden="true">
        {pista}
        {pista}
      </div>
      <p className="sr-only">{mensajes.join(". ")}.</p>
    </div>
  );
}
