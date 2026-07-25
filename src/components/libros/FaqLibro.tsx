import type { Libro } from "@/lib/contenido/libros";

/**
 * Preguntas frecuentes.
 *
 * No son preguntas de relleno: son las objeciones que frenan la compra, y por eso
 * van justo antes del último empujón. El `FAQPage` con los mismos textos lo emite
 * la página, para que Google pueda mostrarlas en el resultado de búsqueda.
 */
export function FaqLibro({ libro }: { libro: Libro }) {
  return (
    <section aria-labelledby="titulo-faq" className="scroll-mt-24">
      <h2 id="titulo-faq" className="text-2xl sm:text-3xl">
        Preguntas frecuentes
      </h2>

      <div className="mt-6 divide-y divide-borde overflow-hidden rounded-lg border border-borde bg-superficie">
        {libro.faq.map((entrada) => (
          <details key={entrada.pregunta} className="group">
            <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4 transition-colors hover:bg-superficie-tenue sm:px-5">
              <span className="flex-1 font-titulares text-[1.0625rem] leading-snug font-semibold text-texto">
                {entrada.pregunta}
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="mt-1 size-4 shrink-0 text-texto-tenue transition-transform group-open:rotate-180"
              >
                <path d="m5 8 5 5 5-5" />
              </svg>
            </summary>
            <p className="border-t border-borde bg-fondo-alterno px-4 py-4 text-[0.9375rem] leading-relaxed text-texto-tenue sm:px-5">
              {entrada.respuesta}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
