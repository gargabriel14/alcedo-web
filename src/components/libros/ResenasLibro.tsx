import type { Libro } from "@/lib/contenido/libros";
import { TESTIMONIOS } from "@/lib/datos/testimonios";

/**
 * Reseñas del libro.
 *
 * Solo salen las reales y solo las de este libro. Mientras no haya ninguna, se
 * muestra el hueco explicando cómo se consiguen: es más útil para el fundador y
 * más honesto con el lector que rellenar con elogios inventados.
 *
 * Este bloque es también el que decide si la ficha emite `aggregateRating`: si
 * aquí no hay nada, el JSON-LD tampoco lo lleva.
 */
export function ResenasLibro({ libro }: { libro: Libro }) {
  const resenas = TESTIMONIOS.filter(
    (testimonio) => !testimonio.pendiente && testimonio.libro === libro.slug,
  );

  return (
    <section aria-labelledby="titulo-resenas" className="scroll-mt-24">
      <h2 id="titulo-resenas" className="text-2xl sm:text-3xl">
        Lo que dicen los lectores
      </h2>

      {resenas.length > 0 ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {resenas.map((resena) => (
            <li key={resena.autor + resena.cita.slice(0, 20)} className="flex">
              <figure className="flex flex-1 flex-col rounded-lg border border-borde bg-superficie p-5 shadow-tarjeta">
                <blockquote className="flex-1 text-[0.9375rem] leading-relaxed text-texto">
                  <p>{resena.cita}</p>
                </blockquote>
                <figcaption className="mt-4 border-t border-borde pt-3.5 text-sm">
                  <span className="block font-semibold text-texto">{resena.autor}</span>
                  <span className="block text-texto-tenue">
                    {resena.contexto} · {resena.procedencia}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-borde-fuerte bg-fondo-alterno p-5">
          <p className="text-sm leading-relaxed text-texto-tenue">
            <strong className="font-semibold text-texto">
              Todavía no hay reseñas de este libro.
            </strong>{" "}
            No ponemos ninguna hasta que un lector real la escriba. Cuando lleguen las
            tres primeras, se añaden en{" "}
            <code className="rounded border border-borde bg-superficie px-1 py-0.5 text-[0.8em]">
              src/lib/datos/testimonios.ts
            </code>{" "}
            con <code>libro: &quot;{libro.slug}&quot;</code> y aparecen aquí.
          </p>
        </div>
      )}
    </section>
  );
}
