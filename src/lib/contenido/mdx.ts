import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ZodType } from "zod";

/**
 * Lectura del contenido editorial.
 *
 * Todo pasa por aquí: se lee del disco **en tiempo de build**, se separa el
 * frontmatter del cuerpo MDX y se valida contra un esquema de Zod. Nada de esto
 * llega al navegador: son módulos de servidor.
 *
 * Si un fichero no cumple el esquema, se lanza un error con el nombre del
 * fichero y los campos que fallan, y el build se detiene.
 */

const DIRECTORIO_CONTENIDO = path.join(process.cwd(), "content");

export interface Documento<T> {
  /** Nombre del fichero sin extensión. Es la URL. */
  slug: string;
  datos: T;
  /** Cuerpo MDX en crudo, sin el frontmatter. */
  cuerpo: string;
}

/** Memoria por colección: en un build se leen los mismos ficheros muchas veces. */
const cache = new Map<string, Documento<unknown>[]>();

function rutaColeccion(coleccion: string): string {
  return path.join(DIRECTORIO_CONTENIDO, coleccion);
}

function mensajeDeError(
  coleccion: string,
  fichero: string,
  problemas: { path: PropertyKey[]; message: string }[],
): string {
  const detalles = problemas
    .map((problema) => {
      const campo = problema.path.length > 0 ? problema.path.join(".") : "(raíz)";
      return `  · ${campo}: ${problema.message}`;
    })
    .join("\n");

  return [
    "",
    `❌ Frontmatter inválido en content/${coleccion}/${fichero}`,
    detalles,
    "",
    "Consulta CONTENIDO.md para ver un ejemplo completo de este tipo de ficha.",
    "",
  ].join("\n");
}

/**
 * Lee y valida una colección entera. Lanza si algún fichero está mal.
 */
export function leerColeccion<T>(coleccion: string, esquema: ZodType<T>): Documento<T>[] {
  const enCache = cache.get(coleccion);
  if (enCache) return enCache as Documento<T>[];

  const directorio = rutaColeccion(coleccion);

  if (!fs.existsSync(directorio)) {
    throw new Error(
      `No existe el directorio content/${coleccion}. Créalo y añade al menos un .mdx.`,
    );
  }

  const ficheros = fs
    .readdirSync(directorio)
    .filter((fichero) => fichero.endsWith(".mdx"))
    .sort();

  if (ficheros.length === 0) {
    throw new Error(`content/${coleccion} está vacío: hace falta al menos un .mdx.`);
  }

  const documentos = ficheros.map((fichero) => {
    const crudo = fs.readFileSync(path.join(directorio, fichero), "utf8");
    const { data, content } = matter(crudo);

    const resultado = esquema.safeParse(data);
    if (!resultado.success) {
      throw new Error(mensajeDeError(coleccion, fichero, resultado.error.issues));
    }

    return {
      slug: fichero.replace(/\.mdx$/, ""),
      datos: resultado.data,
      cuerpo: content.trim(),
    };
  });

  cache.set(coleccion, documentos);
  return documentos;
}

/** Un documento concreto, o `undefined` si no existe ese slug. */
export function leerDocumento<T>(
  coleccion: string,
  esquema: ZodType<T>,
  slug: string,
): Documento<T> | undefined {
  return leerColeccion(coleccion, esquema).find((documento) => documento.slug === slug);
}
