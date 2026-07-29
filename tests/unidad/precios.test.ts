import { describe, expect, it } from "vitest";
import { obtenerLibro } from "@/lib/contenido/libros";
import {
  ficherosDelProducto,
  obtenerProducto,
  todosLosProductos,
} from "@/lib/contenido/productos";
import { formatearPrecio } from "@/lib/utils";

/** Intl usa espacio duro antes del símbolo; para comparar da igual. */
function normalizar(texto: string): string {
  return texto.replace(/ /g, " ");
}

describe("formato de precios", () => {
  it("no inventa céntimos cuando el precio es redondo", () => {
    expect(normalizar(formatearPrecio(29))).toBe("29 €");
  });

  it("los muestra cuando existen", () => {
    expect(normalizar(formatearPrecio(5.99))).toBe("5,99 €");
    expect(normalizar(formatearPrecio(18.9))).toBe("18,90 €");
  });

  it("usa la coma decimal española", () => {
    expect(normalizar(formatearPrecio(1234.5))).toBe("1234,50 €");
  });
});

describe("coherencia del catálogo", () => {
  const productos = todosLosProductos();

  it("todo producto de libro cobra lo que anuncia la ficha", () => {
    for (const producto of productos) {
      if (producto.tipo !== "libro" || !producto.libroRelacionado) continue;

      const libro = obtenerLibro(producto.libroRelacionado);
      expect(libro, `falta el libro de ${producto.sku}`).toBeDefined();
      expect(producto.precioEUR, `precio descuadrado en ${producto.sku}`).toBe(
        libro!.precios.pdf,
      );
    }
  });

  it("ningún sku está repetido", () => {
    const skus = productos.map((producto) => producto.sku);
    expect(new Set(skus).size).toBe(skus.length);
  });

  it("todo producto activo entrega al menos un fichero", () => {
    for (const producto of productos) {
      if (!producto.activo) continue;
      expect(
        ficherosDelProducto(producto).length,
        `${producto.sku} no entrega nada`,
      ).toBeGreaterThan(0);
    }
  });
});

describe("bundles", () => {
  const bundle = obtenerProducto("bundle-practico-completo");

  it("hereda los ficheros de los productos que incluye", () => {
    expect(bundle).toBeDefined();

    const heredados = ficherosDelProducto(bundle!);
    const excel = obtenerProducto("pdf-excel-autonomos")!;
    const ia = obtenerProducto("pdf-ia-autonomos-pymes")!;

    expect(heredados.length).toBe(excel.ficheros.length + ia.ficheros.length);
    expect(heredados.map((fichero) => fichero.ruta)).toContain(excel.ficheros[0]!.ruta);
  });

  it("cuesta menos que comprar los productos por separado", () => {
    const sueltos = bundle!.bundleDe.reduce(
      (total, sku) => total + (obtenerProducto(sku)?.precioEUR ?? 0),
      0,
    );

    expect(bundle!.precioEUR).toBeLessThan(sueltos);
  });
});
