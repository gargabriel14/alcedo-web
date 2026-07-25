import GithubSlugger from "github-slugger";

/**
 * Índice de contenidos y tiempo de lectura de un artículo.
 *
 * Los `id` se generan con el mismo algoritmo que usa `rehype-slug` al renderizar
 * el MDX (ambos son github-slugger), así que los enlaces del índice apuntan
 * siempre a un ancla que existe.
 */

export interface EntradaIndice {
  nivel: 2 | 3;
  texto: string;
  id: string;
}

/** Quita los bloques de código para no confundir un comentario `## algo`. */
function sinBloquesDeCodigo(markdown: string): string {
  return markdown.replace(/```[\s\S]*?```/g, "");
}

/** Limpia el marcado en línea: `**negrita**`, `` `código` ``, enlaces. */
function textoLlano(titular: string): string {
  return titular
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .trim();
}

export function extraerIndice(markdown: string): EntradaIndice[] {
  const slugger = new GithubSlugger();
  const entradas: EntradaIndice[] = [];

  for (const linea of sinBloquesDeCodigo(markdown).split("\n")) {
    const coincidencia = /^(#{2,3})\s+(.+)$/.exec(linea);
    if (!coincidencia) continue;

    const [, almohadillas, titularCrudo] = coincidencia;
    if (!almohadillas || !titularCrudo) continue;

    const texto = textoLlano(titularCrudo);
    entradas.push({
      nivel: almohadillas.length === 2 ? 2 : 3,
      texto,
      id: slugger.slug(texto),
    });
  }

  return entradas;
}

/**
 * Minutos de lectura. 200 palabras por minuto es la media conservadora para
 * castellano; redondeamos hacia arriba y nunca decimos menos de un minuto.
 */
export function minutosDeLectura(markdown: string): number {
  const palabras = sinBloquesDeCodigo(markdown)
    .replace(/[#>*_`\[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(palabras / 200));
}
