import Link from "next/link";
import { Contenedor } from "@/components/ui/Contenedor";
import { Revelar } from "@/components/ui/Revelar";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { DIAS_GARANTIA, MESES_ACTUALIZACION } from "@/lib/garantia";

/**
 * El Compromiso Alcedo.
 *
 * No es relleno de marca: son las cuatro objeciones que frenan una compra de
 * 29 € a un desconocido en internet, contestadas antes de que las formule.
 *
 * Las dos últimas son promesas contractuales, así que los plazos se leen de
 * `src/lib/garantia.ts`, que es el mismo módulo que decide si una devolución o
 * una actualización siguen vigentes. El texto y el sistema no pueden divergir.
 */
const COMPROMISOS = [
  {
    titulo: "Nada de relleno",
    texto:
      "Si un capítulo no te hace mejor en algo concreto, no entra en el libro. Preferimos 150 páginas que se usan a 400 que se abandonan en la página 30.",
  },
  {
    titulo: "Plantillas que funcionan",
    texto:
      "Cada guía viene con ficheros listos para usar, probados con datos reales y con la normativa española en la mano, no con ejemplos de manual.",
  },
  {
    titulo: `Actualización gratuita ${MESES_ACTUALIZACION} meses`,
    texto:
      "Si cambia la ley, el programa o el precio de algo que sale en el libro, actualizamos el fichero y te avisamos. Guardamos la versión de tu compra: mientras estés en plazo, descargas siempre la última sin pagar otra vez.",
  },
  {
    titulo: `${DIAS_GARANTIA} días de garantía`,
    texto:
      "Si no te sirve, escribes y te devolvemos el dinero, aunque ya lo hayas descargado. La cuenta atrás la lleva el sistema, no nuestra palabra: en tu área de cliente verás los días exactos que te quedan en cada compra.",
  },
] as const;

export function CompromisoAlcedo() {
  return (
    // `sobre-oscuro` redefine los tokens de la banda: texto, bordes, marca y
    // anillo de foco pasan a sus valores para fondo oscuro sin repintar nada.
    <section
      aria-labelledby="titulo-compromiso"
      className="sobre-oscuro bg-fondo py-20 text-texto sm:py-28"
    >
      <Contenedor>
        <TituloSeccion
          id="titulo-compromiso"
          ojo="Compromiso Alcedo"
          titulo={
            <>
              Lo que puedes <em>esperar</em> de nosotros
            </>
          }
          entrada="Somos una editorial pequeña. Nuestra única ventaja es que respondemos de lo que publicamos."
        />

        <ol className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {COMPROMISOS.map((compromiso, indice) => (
            <li key={compromiso.titulo}>
              <Revelar retraso={indice * 70} className="border-t border-borde-fuerte pt-6">
                <p
                  aria-hidden="true"
                  className="text-[0.65rem] font-semibold tracking-[0.24em] text-marca uppercase"
                >
                  {String(indice + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-titulares text-xl leading-snug text-texto">
                  {compromiso.titulo}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-texto-tenue">
                  {compromiso.texto}
                </p>
              </Revelar>
            </li>
          ))}
        </ol>

        <p className="mt-14 text-sm text-texto-tenue">
          Las condiciones completas, en{" "}
          <Link href="/legal/terminos" className="underline hover:text-marca-texto">
            términos de compra
          </Link>
          . Los precios de la web se muestran con impuestos incluidos.
        </p>
      </Contenedor>
    </section>
  );
}
