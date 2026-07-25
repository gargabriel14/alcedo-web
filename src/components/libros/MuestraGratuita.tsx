import { VisorMuestras } from "@/components/libros/VisorMuestras";
import type { Libro } from "@/lib/contenido/libros";

/**
 * Muestra gratuita: dos o tres páginas reales del interior.
 *
 * Es el bloque que más confianza da en un producto digital, porque demuestra el
 * nivel de maquetación antes de pagar. Si todavía no hay imágenes, se muestra el
 * hueco con instrucciones en vez de inventar nada: una muestra falsa haría más
 * daño que no tenerla.
 */
export function MuestraGratuita({ libro }: { libro: Libro }) {
  return (
    <section aria-labelledby="titulo-muestra" className="scroll-mt-24">
      <h2 id="titulo-muestra" className="text-2xl sm:text-3xl">
        Míralo por dentro
      </h2>
      <p className="mt-2 text-texto-tenue">
        Páginas reales del libro, sin retoques. Pulsa para ampliarlas.
      </p>

      {libro.muestras.length > 0 ? (
        <VisorMuestras muestras={libro.muestras} titulo={libro.titulo} />
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-borde-fuerte bg-fondo-alterno p-5">
          <div className="grid grid-cols-3 gap-4" aria-hidden="true">
            {[0, 1, 2].map((indice) => (
              <div
                key={indice}
                className="flex aspect-[3/4] items-center justify-center rounded-sm border border-dashed border-borde-fuerte bg-superficie/60"
              >
                <span className="font-titulares text-2xl text-texto-tenue/40">
                  {indice + 1}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-texto-tenue">
            <strong className="font-semibold text-texto">
              Muestra pendiente de subir.
            </strong>{" "}
            Exporta dos o tres páginas del interior a JPG o WebP, guárdalas en{" "}
            <code className="rounded border border-borde bg-superficie px-1 py-0.5 text-[0.8em]">
              public/muestras/{libro.slug}/
            </code>{" "}
            y añádelas al campo <code>muestras</code> del fichero del libro. El visor
            se activa solo.
          </p>
        </div>
      )}
    </section>
  );
}
