/**
 * Testimonios de lectores.
 *
 * REGLA QUE NO SE SALTA: aquí solo entran reseñas reales, con permiso de quien
 * las escribió. Inventar testimonios es publicidad engañosa (Ley 3/1991 de
 * competencia desleal) y Google penaliza el `aggregateRating` falso.
 *
 * Mientras el array esté vacío de reseñas reales, la home muestra los huecos
 * maquetados con el marcador `[[RESEÑA PENDIENTE]]` para que se vea el diseño,
 * y el JSON-LD del sitio NO emite ninguna valoración agregada.
 */

export interface Testimonio {
  /** Texto literal de la reseña. */
  cita: string;
  autor: string;
  /** Oficio o contexto: da credibilidad y ayuda a que el lector se reconozca. */
  contexto: string;
  /** De dónde sale: «Amazon», «Lector beta», «Email»… */
  procedencia: string;
  /** `true` = hueco de maqueta, no se cuenta como reseña ni sale en JSON-LD. */
  pendiente?: boolean;
}

export const TESTIMONIOS: readonly Testimonio[] = [
  {
    cita: "[[RESEÑA PENDIENTE]] Aquí irá la reseña de un lector real, con su nombre y su oficio. Tres o cuatro líneas: qué problema tenía antes, qué hizo con el libro y cuánto tiempo le ahorró.",
    autor: "[[NOMBRE DEL LECTOR]]",
    contexto: "[[OFICIO O CONTEXTO]]",
    procedencia: "Pendiente",
    pendiente: true,
  },
  {
    cita: "[[RESEÑA PENDIENTE]] Las mejores reseñas son concretas y con cifras: «pasé de tres horas a veinte minutos por trimestre». Pide a los primeros compradores exactamente eso.",
    autor: "[[NOMBRE DEL LECTOR]]",
    contexto: "[[OFICIO O CONTEXTO]]",
    procedencia: "Pendiente",
    pendiente: true,
  },
  {
    cita: "[[RESEÑA PENDIENTE]] Con tres reseñas reales se puede retirar este bloque de marcadores y activar la valoración agregada en los datos estructurados.",
    autor: "[[NOMBRE DEL LECTOR]]",
    contexto: "[[OFICIO O CONTEXTO]]",
    procedencia: "Pendiente",
    pendiente: true,
  },
] as const;

/** Solo las reseñas reales. Es lo que puede alimentar `aggregateRating`. */
export const TESTIMONIOS_REALES = TESTIMONIOS.filter((t) => !t.pendiente);
