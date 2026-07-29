import { describe, expect, it } from "vitest";
import { todosLosArticulos } from "@/lib/contenido/blog";
import { esquemaLibro } from "@/lib/contenido/esquemas";
import { extraerIndice, minutosDeLectura } from "@/lib/contenido/indice";
import { todosLosLibros } from "@/lib/contenido/libros";

/**
 * La validación del frontmatter es lo que impide publicar un libro sin precio o
 * sin FAQ. Si estos tests dejan de fallar cuando faltan campos, es que la red de
 * seguridad se ha caído.
 */

const LIBRO_VALIDO = {
  titulo: "Excel para fotógrafos",
  subtitulo: "De la sesión a la factura sin perder una foto",
  sello: "practico",
  autor: "g-g-alcedo",
  estado: "publicado",
  fecha: "2026-05-12",
  paginas: 150,
  gancho:
    "Una guía para llevar el negocio fotográfico con una sola hoja de cálculo, de la reserva al cobro.",
  resultados: [
    "Presupuestar una sesión con todos los costes dentro",
    "Controlar qué cliente ha pagado y cuál no",
    "Calcular el precio de una ampliación sin perder dinero",
    "Llevar el registro de derechos de imagen firmados",
    "Cerrar el trimestre sin buscar facturas",
  ],
  precios: { pdf: 29, kindle: 5.99 },
  promesaPdf: "incluye las plantillas editables; el Kindle, no",
  sku: "pdf-excel-fotografos",
  temas: ["excel"],
  entregables: [{ titulo: "Cuaderno de plantillas", tipo: "excel" }],
  indice: [
    { titulo: "Primero", apartados: [] },
    { titulo: "Segundo", apartados: [] },
    { titulo: "Tercero", apartados: [] },
  ],
  faq: [
    { pregunta: "¿Sirve con Sheets?", respuesta: "Sí, las plantillas van en los dos." },
    { pregunta: "¿Necesito saber Excel?", respuesta: "No, se empieza desde cero." },
    { pregunta: "¿Y si cambia la ley?", respuesta: "Se actualiza y te avisamos." },
  ],
};

describe("validación del frontmatter de un libro", () => {
  it("acepta una ficha completa", () => {
    expect(esquemaLibro.safeParse(LIBRO_VALIDO).success).toBe(true);
  });

  it("acepta la fecha sin comillas, que YAML convierte en Date", () => {
    const resultado = esquemaLibro.safeParse({
      ...LIBRO_VALIDO,
      fecha: new Date("2026-05-12T00:00:00Z"),
    });

    expect(resultado.success).toBe(true);
    if (resultado.success) expect(resultado.data.fecha).toBe("2026-05-12");
  });

  it("rechaza menos de cinco resultados", () => {
    const resultado = esquemaLibro.safeParse({
      ...LIBRO_VALIDO,
      resultados: LIBRO_VALIDO.resultados.slice(0, 3),
    });

    expect(resultado.success).toBe(false);
  });

  it("rechaza menos de tres preguntas frecuentes", () => {
    const resultado = esquemaLibro.safeParse({
      ...LIBRO_VALIDO,
      faq: LIBRO_VALIDO.faq.slice(0, 2),
    });

    expect(resultado.success).toBe(false);
  });

  it("rechaza un precio de cero", () => {
    const resultado = esquemaLibro.safeParse({
      ...LIBRO_VALIDO,
      precios: { pdf: 0, kindle: 5.99 },
    });

    expect(resultado.success).toBe(false);
  });

  it("rechaza un sku con mayúsculas o espacios", () => {
    expect(esquemaLibro.safeParse({ ...LIBRO_VALIDO, sku: "PDF Excel" }).success).toBe(
      false,
    );
  });

  it("señala el campo exacto que falla", () => {
    const resultado = esquemaLibro.safeParse({ ...LIBRO_VALIDO, paginas: -3 });

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues[0]?.path).toEqual(["paginas"]);
    }
  });
});

describe("catálogo real", () => {
  it("todos los libros del repositorio pasan la validación", () => {
    expect(todosLosLibros().length).toBeGreaterThan(0);
  });

  it("cada artículo apunta a un libro que existe", () => {
    const slugs = new Set(todosLosLibros().map((libro) => libro.slug));

    for (const articulo of todosLosArticulos()) {
      expect(slugs.has(articulo.libroRelacionado), articulo.slug).toBe(true);
    }
  });
});

describe("índice y tiempo de lectura", () => {
  const markdown = [
    "Un párrafo de entrada.",
    "",
    "## Primer titular",
    "",
    "Texto.",
    "",
    "### Un subapartado",
    "",
    "```",
    "## esto es código, no un titular",
    "```",
    "",
    "## Segundo titular con **negrita**",
  ].join("\n");

  it("solo recoge los titulares de verdad", () => {
    const indice = extraerIndice(markdown);

    expect(indice.map((entrada) => entrada.texto)).toEqual([
      "Primer titular",
      "Un subapartado",
      "Segundo titular con negrita",
    ]);
  });

  it("genera anclas compatibles con las que pone rehype-slug", () => {
    const indice = extraerIndice("## Cómo calcular el 303");
    expect(indice[0]?.id).toBe("cómo-calcular-el-303");
  });

  it("distingue los niveles", () => {
    const indice = extraerIndice(markdown);
    expect(indice.map((entrada) => entrada.nivel)).toEqual([2, 3, 2]);
  });

  it("nunca dice menos de un minuto", () => {
    expect(minutosDeLectura("Dos palabras")).toBe(1);
  });
});
