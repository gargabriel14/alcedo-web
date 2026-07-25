import { obtenerAutor } from "@/lib/contenido/autores";
import { esquemaLibro, type FrontmatterLibro } from "@/lib/contenido/esquemas";
import { leerColeccion } from "@/lib/contenido/mdx";
import type { ClaveSello } from "@/lib/sellos";

export type Libro = FrontmatterLibro & {
  slug: string;
  /** Descripción larga en MDX: se renderiza en la ficha, bajo el gancho. */
  cuerpo: string;
  /** Nombre del autor tal y como se muestra, resuelto desde `/content/autores`. */
  autorNombre: string;
};

const COLECCION = "libros";

/**
 * Todos los libros, del más reciente al más antiguo.
 *
 * Comprueba también la integridad referencial: si un libro apunta a un autor que
 * no existe, el build se detiene. Un enlace roto a la ficha del autor es una
 * página de error en mitad de un embudo de venta.
 */
export function todosLosLibros(): Libro[] {
  return leerColeccion(COLECCION, esquemaLibro)
    .map(({ slug, datos, cuerpo }) => {
      const autor = obtenerAutor(datos.autor);

      if (!autor) {
        throw new Error(
          `\n❌ content/libros/${slug}.mdx apunta al autor «${datos.autor}», que no existe.\n   Crea content/autores/${datos.autor}.mdx o corrige el campo «autor».\n`,
        );
      }

      return { slug, ...datos, cuerpo, autorNombre: autor.nombre };
    })
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function obtenerLibro(slug: string): Libro | undefined {
  return todosLosLibros().find((libro) => libro.slug === slug);
}

export function librosDelSello(sello: ClaveSello): Libro[] {
  return todosLosLibros().filter((libro) => libro.sello === sello);
}

export function librosDelAutor(slugAutor: string): Libro[] {
  return todosLosLibros().filter((libro) => libro.autor === slugAutor);
}

/**
 * El libro de la portada. Si nadie lleva `destacado: true`, cae en el más
 * reciente que esté publicado, para que la home nunca se quede sin héroe.
 */
export function libroDestacado(): Libro {
  const libros = todosLosLibros();
  const marcado = libros.find((libro) => libro.destacado);
  if (marcado) return marcado;

  const publicado = libros.find((libro) => libro.estado === "publicado");
  return publicado ?? libros[0]!;
}

/**
 * Venta cruzada: otros libros del mismo sello. Si el sello se queda corto, se
 * completa con lo más reciente del catálogo, porque un hueco vacío no vende.
 */
export function librosRelacionados(libro: Libro, limite = 3): Libro[] {
  const mismoSello = librosDelSello(libro.sello).filter((otro) => otro.slug !== libro.slug);
  if (mismoSello.length >= limite) return mismoSello.slice(0, limite);

  const yaIncluidos = new Set(mismoSello.map((otro) => otro.slug));
  const resto = todosLosLibros().filter(
    (otro) => otro.slug !== libro.slug && !yaIncluidos.has(otro.slug),
  );

  return [...mismoSello, ...resto].slice(0, limite);
}

/** Temas únicos para el filtro del catálogo, en orden alfabético. */
export function temasDisponibles(): string[] {
  const temas = new Set<string>();
  for (const libro of todosLosLibros()) {
    for (const tema of libro.temas) temas.add(tema);
  }
  return [...temas].sort((a, b) => a.localeCompare(b, "es"));
}
