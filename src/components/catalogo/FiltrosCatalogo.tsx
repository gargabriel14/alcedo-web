"use client";

import { useMemo, useState } from "react";
import { TarjetaLibro } from "@/components/libros/TarjetaLibro";
import {
  ETIQUETAS_FORMATO,
  FORMATOS,
  type FormatoLibro,
  type LibroTarjeta,
} from "@/lib/contenido/tarjeta";
import { LISTA_SELLOS, type ClaveSello } from "@/lib/sellos";
import { cn } from "@/lib/utils";

const TODOS = "todos" as const;
type Opcion<T> = T | typeof TODOS;

/**
 * Filtros del catálogo.
 *
 * Se filtra en el navegador y no con parámetros en la URL por dos razones:
 * la página sigue siendo estática (se sirve desde la CDN) y **todos los libros
 * están en el HTML**, así que Google los indexa aunque haya un filtro activo. La
 * dimensión que sí interesa posicionar, el sello, tiene su propia URL en
 * `/sellos/[sello]`.
 *
 * Los datos que cruzan al cliente son `LibroTarjeta`, no el libro completo: sin
 * cuerpo MDX, sin índice y sin FAQ.
 */
export function FiltrosCatalogo({
  libros,
  temas,
}: {
  libros: readonly LibroTarjeta[];
  temas: readonly string[];
}) {
  const [sello, setSello] = useState<Opcion<ClaveSello>>(TODOS);
  const [tema, setTema] = useState<Opcion<string>>(TODOS);
  const [formato, setFormato] = useState<Opcion<FormatoLibro>>(TODOS);

  const visibles = useMemo(
    () =>
      libros.filter(
        (libro) =>
          (sello === TODOS || libro.sello === sello) &&
          (tema === TODOS || libro.temas.includes(tema)) &&
          (formato === TODOS || libro.formatos.includes(formato)),
      ),
    [libros, sello, tema, formato],
  );

  const hayFiltros = sello !== TODOS || tema !== TODOS || formato !== TODOS;

  function limpiar() {
    setSello(TODOS);
    setTema(TODOS);
    setFormato(TODOS);
  }

  return (
    <div>
      <div className="flex flex-col gap-5 rounded-lg border border-borde bg-superficie p-5">
        <GrupoFiltro
          etiqueta="Sello"
          opciones={[
            { valor: TODOS, texto: "Todos" },
            ...LISTA_SELLOS.map((s) => ({ valor: s.clave, texto: s.nombre })),
          ]}
          activo={sello}
          alElegir={setSello}
        />

        <GrupoFiltro
          etiqueta="Tema"
          opciones={[
            { valor: TODOS, texto: "Todos" },
            ...temas.map((t) => ({ valor: t, texto: t })),
          ]}
          activo={tema}
          alElegir={setTema}
          capitalizar
        />

        <GrupoFiltro
          etiqueta="Formato"
          opciones={[
            { valor: TODOS, texto: "Todos" },
            ...FORMATOS.map((f) => ({ valor: f, texto: ETIQUETAS_FORMATO[f] })),
          ]}
          activo={formato}
          alElegir={setFormato}
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p aria-live="polite" className="text-sm text-texto-tenue">
          {visibles.length === libros.length
            ? `${libros.length} ${libros.length === 1 ? "libro" : "libros"} en el catálogo`
            : `${visibles.length} de ${libros.length} ${libros.length === 1 ? "libro" : "libros"}`}
        </p>

        {hayFiltros ? (
          <button
            type="button"
            onClick={limpiar}
            className="text-sm font-medium text-marca-texto underline underline-offset-2 hover:text-marca-hover"
          >
            Quitar filtros
          </button>
        ) : null}
      </div>

      {visibles.length > 0 ? (
        <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((libro) => (
            <li key={libro.slug} className="flex">
              <TarjetaLibro libro={libro} sinSello={sello !== TODOS} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-lg border border-dashed border-borde-fuerte p-10 text-center">
          <p className="font-titulares text-xl text-texto">
            Ningún libro con esa combinación
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-texto-tenue">
            Todavía somos una editorial pequeña y publicamos poco a propósito. Prueba
            con menos filtros.
          </p>
          <button
            type="button"
            onClick={limpiar}
            className="mt-5 inline-flex h-10 items-center rounded-md border border-borde-fuerte px-4 text-sm font-medium text-texto hover:border-marca hover:text-marca-texto"
          >
            Ver todo el catálogo
          </button>
        </div>
      )}
    </div>
  );
}

interface PropsGrupo<T extends string> {
  etiqueta: string;
  opciones: readonly { valor: Opcion<T>; texto: string }[];
  activo: Opcion<T>;
  alElegir: (valor: Opcion<T>) => void;
  capitalizar?: boolean;
}

function GrupoFiltro<T extends string>({
  etiqueta,
  opciones,
  activo,
  alElegir,
  capitalizar = false,
}: PropsGrupo<T>) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <span className="ojo-titular sm:w-20 sm:shrink-0">{etiqueta}</span>
      <div className="flex flex-wrap gap-2">
        {opciones.map((opcion) => {
          const seleccionado = activo === opcion.valor;
          return (
            <button
              key={opcion.valor}
              type="button"
              aria-pressed={seleccionado}
              onClick={() => alElegir(opcion.valor)}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-3.5 text-sm transition-colors",
                capitalizar && "first-letter:uppercase",
                seleccionado
                  ? "border-marca bg-marca text-marca-contraste"
                  : "border-borde-fuerte text-texto-tenue hover:border-marca hover:text-marca-texto",
              )}
            >
              {opcion.texto}
            </button>
          );
        })}
      </div>
    </div>
  );
}
