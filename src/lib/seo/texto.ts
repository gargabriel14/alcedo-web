/**
 * Texto para buscadores.
 *
 * Google recorta el título alrededor de los **60 caracteres** y la descripción
 * alrededor de los **160**. Lo que sobra no es que se vea peor: no se ve. En una
 * ficha de libro cuyo título medía 112 caracteres, lo que se perdía era el
 * subtítulo, que es justo donde estaban las palabras por las que se busca.
 *
 * Y una descripción cortada con `slice()` termina a mitad de palabra, que es la
 * señal más barata de que detrás no hay nadie cuidando la página.
 */

/** Longitud a la que Google deja de mostrar el título. */
const LIMITE_TITULO = 60;

/** Longitud útil de la descripción. Por debajo de 160 para tener margen. */
const LIMITE_DESCRIPCION = 155;

/** Lo que el layout añade a cada título: ` · Editorial Alcedo`. */
const SUFIJO = " · Editorial Alcedo";

/**
 * Compone el título de una página.
 *
 * Si el nombre de la marca no cabe, se cae en un título absoluto sin sufijo. Es
 * preferible perder la marca a perder la mitad del título: quien busca «excel
 * para autónomos» necesita ver esas cuatro palabras, no el nombre de la
 * editorial recortado a la mitad.
 *
 * Devuelve la forma que espera `generateMetadata`: una cadena cuando el sufijo
 * cabe, o `{ absolute }` cuando hay que saltárselo.
 */
export function componerTitulo(titulo: string): string | { absolute: string } {
  const limpio = titulo.trim();

  if (limpio.length + SUFIJO.length <= LIMITE_TITULO) return limpio;

  return { absolute: limpio };
}

/**
 * Recorta una descripción sin partir palabras.
 *
 * Busca primero un final de frase; si no lo encuentra dentro del límite, corta
 * en el último espacio y cierra con puntos suspensivos. Una descripción que
 * termina en una frase completa se lee como escrita a propósito.
 */
export function recortarDescripcion(texto: string, limite = LIMITE_DESCRIPCION): string {
  const limpio = texto.replace(/\s+/g, " ").trim();

  if (limpio.length <= limite) return limpio;

  const recorte = limpio.slice(0, limite);

  // Un final de frase dentro del último tercio: se corta ahí y queda natural.
  const finFrase = Math.max(
    recorte.lastIndexOf(". "),
    recorte.lastIndexOf("? "),
    recorte.lastIndexOf("! "),
  );

  if (finFrase > limite * 0.6) return recorte.slice(0, finFrase + 1);

  const ultimoEspacio = recorte.lastIndexOf(" ");
  const cortado = ultimoEspacio > 0 ? recorte.slice(0, ultimoEspacio) : recorte;

  return `${cortado.replace(/[.,;:·—-]+$/, "")}…`;
}
