import { Contenedor } from "@/components/ui/Contenedor";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { TESTIMONIOS } from "@/lib/datos/testimonios";
import { cn } from "@/lib/utils";

/**
 * Reseñas de lectores.
 *
 * Los huecos marcados como `pendiente` se muestran con el marcador visible
 * `[[RESEÑA PENDIENTE]]` para que se vea la maqueta, pero se anuncian como
 * pendientes: no simulan una reseña real. En cuanto haya tres reales, se
 * sustituyen en `src/lib/datos/testimonios.ts` y este bloque no se toca.
 */
export function Testimonios() {
  const hayReales = TESTIMONIOS.some((testimonio) => !testimonio.pendiente);

  return (
    <section aria-labelledby="titulo-testimonios" className="py-16 sm:py-20">
      <Contenedor>
        <TituloSeccion
          id="titulo-testimonios"
          ojo="Lectores"
          titulo="Qué dicen quienes ya lo han usado"
          entrada={
            hayReales
              ? "Reseñas de lectores, con su nombre y su oficio."
              : "Aquí van las reseñas reales de los primeros lectores. Los huecos están maquetados y a la espera: no publicamos testimonios inventados."
          }
        />

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIOS.map((testimonio, indice) => (
            <li key={indice} className="flex">
              <figure
                className={cn(
                  "flex flex-1 flex-col rounded-lg border bg-superficie p-6",
                  testimonio.pendiente
                    ? "border-dashed border-borde-fuerte"
                    : "border-borde shadow-tarjeta",
                )}
              >
                <span
                  aria-hidden="true"
                  className="font-titulares text-4xl leading-none text-marca/40"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-1 flex-1">
                  <p
                    className={cn(
                      "text-[0.9375rem] leading-relaxed",
                      testimonio.pendiente ? "text-texto-tenue italic" : "text-texto",
                    )}
                  >
                    {testimonio.cita}
                  </p>
                </blockquote>
                <figcaption className="mt-4 border-t border-borde pt-4 text-sm">
                  <span className="block font-semibold text-texto">{testimonio.autor}</span>
                  <span className="block text-texto-tenue">
                    {testimonio.contexto} · {testimonio.procedencia}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}
