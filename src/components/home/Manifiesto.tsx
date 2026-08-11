import { Contenedor } from "@/components/ui/Contenedor";
import { Revelar } from "@/components/ui/Revelar";

/**
 * El manifiesto.
 *
 * Una sola frase, grande, con espacio alrededor. Corta el ritmo entre dos
 * secciones de producto y deja hablar a la marca sin vender nada: es lo que
 * separa una editorial de un catálogo. Si esta frase no fuera cierta, sobraría.
 */
export function Manifiesto() {
  return (
    <section aria-label="Manifiesto editorial" className="bg-fondo-alterno py-20 sm:py-28">
      <Contenedor>
        <Revelar>
          <p className="ojo-titular mb-9">Manifiesto</p>
        </Revelar>

        <Revelar retraso={100}>
          <p className="max-w-[26em] font-titulares text-[clamp(1.5rem,3.4vw,2.8rem)] leading-[1.4] font-medium text-texto">
            Publicamos libros que terminan donde termina el problema:{" "}
            <em className="text-marca-texto italic">en una plantilla que ya funciona</em>.
            Si un capítulo no cambia nada en tu semana, no entra.
          </p>
        </Revelar>
      </Contenedor>
    </section>
  );
}
