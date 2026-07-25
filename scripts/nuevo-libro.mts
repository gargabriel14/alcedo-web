/**
 * Crea la ficha MDX de un libro nuevo con todos los campos que exige el esquema.
 *
 *   pnpm nuevo-libro "Excel para fotógrafos" --sello=practico
 *
 * Se ejecuta con el TypeScript nativo de Node, sin compilar nada.
 * No sobrescribe ficheros: si el libro ya existe, avisa y no toca nada.
 */

import fs from "node:fs";
import path from "node:path";

const SELLOS_VALIDOS = ["practico", "vida", "labs"] as const;
type Sello = (typeof SELLOS_VALIDOS)[number];

function slugificar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita tildes y diéresis
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function leerArgumentos(): { titulo: string; sello: Sello; autor: string } {
  const argumentos = process.argv.slice(2);
  const sueltos = argumentos.filter((argumento) => !argumento.startsWith("--"));
  const titulo = sueltos.join(" ").trim();

  if (!titulo) {
    console.error(
      [
        "",
        "Falta el título. Uso:",
        '  pnpm nuevo-libro "Excel para fotógrafos" --sello=practico',
        "",
        `Sellos disponibles: ${SELLOS_VALIDOS.join(", ")}`,
        "",
      ].join("\n"),
    );
    process.exit(1);
  }

  const selloArgumento = argumentos
    .find((argumento) => argumento.startsWith("--sello="))
    ?.split("=")[1];

  if (selloArgumento && !SELLOS_VALIDOS.includes(selloArgumento as Sello)) {
    console.error(
      `\n«${selloArgumento}» no es un sello válido. Usa uno de: ${SELLOS_VALIDOS.join(", ")}\n`,
    );
    process.exit(1);
  }

  const autor =
    argumentos.find((argumento) => argumento.startsWith("--autor="))?.split("=")[1] ??
    "g-g-alcedo";

  return {
    titulo,
    sello: (selloArgumento as Sello | undefined) ?? "practico",
    autor,
  };
}

function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

function plantilla(titulo: string, slug: string, sello: Sello, autor: string): string {
  return `---
titulo: ${titulo}
subtitulo: TODO subtítulo que concrete el resultado, no el tema
sello: ${sello}
autor: ${autor}
estado: en-preparacion
fecha: ${hoy()}
paginas: 150
destacado: false
gancho: >-
  TODO dos o tres frases de venta. Qué problema quita de encima y con qué se lo
  lleva el lector. Escríbelo como si se lo contaras a un cliente por teléfono.
resultados:
  - TODO resultado concreto en verbo, cosas que sabrá hacer al terminar
  - TODO segundo resultado
  - TODO tercer resultado
  - TODO cuarto resultado
  - TODO quinto resultado
precios:
  pdf: 29
  kindle: 5.99
  tapaBlanda: 18.9
promesaPdf: TODO por qué el PDF Premium gana al Kindle, con la cifra concreta
sku: pdf-${slug.slice(0, 40)}
temas:
  - TODO tema
entregables:
  - titulo: TODO nombre del fichero descargable
    tipo: excel
indice:
  - titulo: TODO primer capítulo
    pagina: 11
    apartados:
      - TODO apartado
  - titulo: TODO segundo capítulo
    pagina: 30
    apartados: []
  - titulo: TODO tercer capítulo
    pagina: 60
    apartados: []
muestras: []
faq:
  - pregunta: TODO la objeción número uno que frena la compra
    respuesta: >-
      TODO respuesta honesta y concreta. Si la respuesta es «no», dilo: se vende
      mejor un «no» claro que un «depende».
  - pregunta: TODO segunda objeción
    respuesta: >-
      TODO respuesta.
  - pregunta: TODO tercera objeción
    respuesta: >-
      TODO respuesta.
portada: null
amazon:
  kindle: null
  tapaBlanda: null
---

TODO descripción larga del libro, en Markdown. Dos o tres párrafos: el problema, cómo
lo resuelve el libro y qué se lleva el lector.

### Para quién es

- TODO
- TODO

### Para quién no es

- TODO
`;
}

function principal(): void {
  const { titulo, sello, autor } = leerArgumentos();
  const slug = slugificar(titulo);
  const directorio = path.join(process.cwd(), "content", "libros");
  const destino = path.join(directorio, `${slug}.mdx`);

  if (!fs.existsSync(directorio)) {
    console.error(`\nNo existe ${directorio}. ¿Estás en la raíz del proyecto?\n`);
    process.exit(1);
  }

  if (fs.existsSync(destino)) {
    console.error(
      `\nYa existe content/libros/${slug}.mdx. No lo toco: bórralo tú si quieres empezar de cero.\n`,
    );
    process.exit(1);
  }

  fs.writeFileSync(destino, plantilla(titulo, slug, sello, autor), "utf8");

  console.log(
    [
      "",
      `✅ Creado content/libros/${slug}.mdx`,
      "",
      "Siguientes pasos:",
      "  1. Abre el fichero y sustituye todos los TODO.",
      "  2. Guarda y ejecuta `pnpm dev`.",
      `  3. Míralo en http://localhost:3000/libro/${slug}`,
      "",
      "Si dejas un campo obligatorio mal, `pnpm build` te dirá exactamente cuál.",
      "La guía completa de cada campo está en CONTENIDO.md.",
      "",
    ].join("\n"),
  );
}

principal();
