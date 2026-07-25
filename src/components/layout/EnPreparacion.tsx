import { EnlaceBoton } from "@/components/ui/Boton";
import { Contenedor } from "@/components/ui/Contenedor";

interface PropsEnPreparacion {
  titulo: string;
  descripcion: string;
  /** Fase del plan en la que se construye esta página. */
  fase: string;
}

/**
 * Página puente.
 *
 * Existe para que ningún enlace de la navegación devuelva un 404 mientras se
 * construyen las secciones reales: un 404 desde el menú se come el presupuesto
 * de rastreo y desconcierta a quien está revisando la web. Todas llevan
 * `noindex`, así que no entran en Google.
 */
export function EnPreparacion({ titulo, descripcion, fase }: PropsEnPreparacion) {
  return (
    <Contenedor ancho="lectura" className="py-20 sm:py-28">
      <p className="ojo-titular">En preparación · {fase}</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">{titulo}</h1>
      <p className="mt-5 text-lg leading-relaxed text-texto-tenue">{descripcion}</p>

      <div className="mt-9 flex flex-wrap gap-3">
        <EnlaceBoton href="/">Volver a la portada</EnlaceBoton>
        <EnlaceBoton href="/recursos" variante="secundario">
          Ver recursos gratuitos
        </EnlaceBoton>
      </div>
    </Contenedor>
  );
}
