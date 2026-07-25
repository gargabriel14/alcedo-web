import type { Libro } from "@/lib/contenido/libros";

/**
 * Índice completo, desplegable.
 *
 * Con `<details>` nativo: desplegable accesible, navegable con teclado y
 * buscable con Ctrl+F en los navegadores modernos, sin un byte de JavaScript.
 * Los capítulos vienen abiertos si el libro tiene pocos, porque el índice es una
 * de las dos cosas que más se miran antes de comprar.
 */
export function IndiceLibro({ libro }: { libro: Libro }) {
  const capitulos = libro.indice;

  return (
    <section aria-labelledby="titulo-indice" className="scroll-mt-24">
      <h2 id="titulo-indice" className="text-2xl sm:text-3xl">
        Índice completo
      </h2>
      <p className="mt-2 text-texto-tenue">
        {capitulos.length} capítulos · {libro.paginas} páginas. Despliega cualquiera
        para ver sus apartados.
      </p>

      <ol className="mt-6 divide-y divide-borde overflow-hidden rounded-lg border border-borde bg-superficie">
        {capitulos.map((capitulo, indice) => (
          <li key={capitulo.titulo}>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-baseline gap-3 px-4 py-3.5 transition-colors hover:bg-superficie-tenue sm:px-5">
                <span
                  aria-hidden="true"
                  className="w-6 shrink-0 font-titulares text-sm font-semibold text-texto-tenue"
                >
                  {String(indice + 1).padStart(2, "0")}
                </span>

                <span className="flex-1 font-titulares text-[1.0625rem] leading-snug font-semibold text-texto">
                  {capitulo.titulo}
                </span>

                {capitulo.pagina ? (
                  <span className="shrink-0 text-xs text-texto-tenue tabular-nums">
                    p. {capitulo.pagina}
                  </span>
                ) : null}

                {capitulo.apartados.length > 0 ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    className="mt-0.5 size-4 shrink-0 text-texto-tenue transition-transform group-open:rotate-180"
                  >
                    <path d="m5 8 5 5 5-5" />
                  </svg>
                ) : null}
              </summary>

              {capitulo.apartados.length > 0 ? (
                <ul className="border-t border-borde bg-fondo-alterno px-4 py-3 pl-13 sm:px-5 sm:pl-14">
                  {capitulo.apartados.map((apartado) => (
                    <li
                      key={apartado}
                      className="py-1 text-sm leading-relaxed text-texto-tenue"
                    >
                      {apartado}
                    </li>
                  ))}
                </ul>
              ) : null}
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
