import {
  esquemaProducto,
  type Fichero,
  type FrontmatterProducto,
} from "@/lib/contenido/esquemas";
import { obtenerLibro } from "@/lib/contenido/libros";
import { leerColeccion } from "@/lib/contenido/mdx";

export type Producto = FrontmatterProducto & {
  slug: string;
  cuerpo: string;
};

const COLECCION = "productos";

/**
 * El catálogo de productos digitales.
 *
 * **Esta es la única fuente de verdad del precio.** El cliente nunca manda un
 * importe: el checkout busca el SKU aquí y usa el precio de este fichero.
 *
 * Además se comprueba la coherencia de todo el catálogo en tiempo de build:
 * un producto que apunta a un libro inexistente, un bundle con un SKU que no
 * existe o —lo más peligroso— un precio distinto del que anuncia la ficha del
 * libro detienen el despliegue. Vender a un precio y cobrar otro es una
 * reclamación segura y un problema con la pasarela.
 */
export function todosLosProductos(): Producto[] {
  const productos = leerColeccion(COLECCION, esquemaProducto).map(
    ({ slug, datos, cuerpo }) => ({ slug, ...datos, cuerpo }),
  );

  const porSku = new Map<string, Producto>();

  for (const producto of productos) {
    if (producto.slug !== producto.sku) {
      throw new Error(
        `\n❌ content/productos/${producto.slug}.mdx declara el sku «${producto.sku}».\n   El nombre del fichero y el sku tienen que coincidir.\n`,
      );
    }
    if (porSku.has(producto.sku)) {
      throw new Error(`\n❌ El sku «${producto.sku}» está repetido en /content/productos.\n`);
    }
    porSku.set(producto.sku, producto);
  }

  for (const producto of productos) {
    if (producto.tipo === "libro") {
      if (!producto.libroRelacionado) {
        throw new Error(
          `\n❌ El producto «${producto.sku}» es de tipo libro pero no declara «libroRelacionado».\n`,
        );
      }

      const libro = obtenerLibro(producto.libroRelacionado);
      if (!libro) {
        throw new Error(
          `\n❌ El producto «${producto.sku}» apunta al libro «${producto.libroRelacionado}», que no existe en /content/libros.\n`,
        );
      }

      if (libro.precios.pdf !== producto.precioEUR) {
        throw new Error(
          [
            "",
            `❌ Precio incoherente para «${producto.sku}»:`,
            `   content/libros/${libro.slug}.mdx dice ${libro.precios.pdf} €`,
            `   content/productos/${producto.sku}.mdx dice ${producto.precioEUR} €`,
            "   La ficha anuncia un precio y el checkout cobraría otro. Cuadra los dos.",
            "",
          ].join("\n"),
        );
      }
    }

    for (const skuIncluido of producto.bundleDe) {
      if (!porSku.has(skuIncluido)) {
        throw new Error(
          `\n❌ El bundle «${producto.sku}» incluye el sku «${skuIncluido}», que no existe.\n`,
        );
      }
    }
  }

  return productos;
}

export function obtenerProducto(sku: string): Producto | undefined {
  return todosLosProductos().find((producto) => producto.sku === sku);
}

/** Productos que se pueden comprar ahora mismo. */
export function productosActivos(): Producto[] {
  return todosLosProductos().filter((producto) => producto.activo);
}

/**
 * Todos los ficheros que da derecho a descargar un producto.
 *
 * Un bundle no repite los ficheros de sus productos: los hereda. Así, actualizar
 * una plantilla de un libro actualiza también el pack sin tocar dos sitios.
 */
export function ficherosDelProducto(producto: Producto): Fichero[] {
  if (producto.bundleDe.length === 0) return [...producto.ficheros];

  const catalogo = todosLosProductos();
  const heredados = producto.bundleDe.flatMap((sku) => {
    const incluido = catalogo.find((candidato) => candidato.sku === sku);
    return incluido ? incluido.ficheros : [];
  });

  return [...producto.ficheros, ...heredados];
}

/** El producto que corresponde a la ficha de un libro. */
export function productoDelLibro(slugLibro: string): Producto | undefined {
  return todosLosProductos().find(
    (producto) => producto.tipo === "libro" && producto.libroRelacionado === slugLibro,
  );
}
