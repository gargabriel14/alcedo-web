import type { TipoEntregable } from "@/lib/contenido/esquemas";
import type { Libro } from "@/lib/contenido/libros";

/**
 * Los entregables, uno a uno y con su icono.
 *
 * Es el bloque que justifica la diferencia de precio con el Kindle, así que cada
 * fichero se lista por separado: «13 plantillas» impresiona menos que ver las
 * cinco líneas de lo que te vas a descargar.
 */
const ETIQUETAS: Record<TipoEntregable, string> = {
  excel: "Excel",
  sheets: "Google Sheets",
  pdf: "PDF",
  plantilla: "Plantilla",
  checklist: "Checklist",
  calendario: "Calendario",
};

export function EntregablesLibro({ libro }: { libro: Libro }) {
  return (
    <section aria-labelledby="titulo-entregables" className="scroll-mt-24">
      <h2 id="titulo-entregables" className="text-2xl sm:text-3xl">
        Lo que te descargas con el PDF Premium
      </h2>
      <p className="mt-2 text-texto-tenue">
        Ficheros editables, no capturas de pantalla. Se descargan al pagar y se
        actualizan cuando el libro se actualiza.
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {libro.entregables.map((entregable) => (
          <li
            key={entregable.titulo}
            className="flex items-start gap-3.5 rounded-lg border border-borde bg-superficie p-4"
          >
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-md bg-marca-suave text-marca-texto"
            >
              <IconoEntregable tipo={entregable.tipo} />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.9375rem] leading-snug font-medium text-texto">
                {entregable.titulo}
              </span>
              <span className="mt-0.5 block text-xs tracking-wide text-texto-tenue uppercase">
                {ETIQUETAS[entregable.tipo]}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function IconoEntregable({ tipo }: { tipo: TipoEntregable }) {
  const comun = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-5",
    "aria-hidden": true,
  };

  switch (tipo) {
    case "excel":
    case "sheets":
      // Hoja de cálculo: rejilla.
      return (
        <svg {...comun}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M3 14.5h18M9 4v16M15 4v16" />
        </svg>
      );
    case "pdf":
      // Documento con esquina doblada.
      return (
        <svg {...comun}>
          <path d="M6 3h7l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
          <path d="M13 3v5h5" />
        </svg>
      );
    case "checklist":
      return (
        <svg {...comun}>
          <path d="M4 6.5 6 8.5 9.5 5M4 13.5 6 15.5 9.5 12M13 7h7M13 14h7" />
        </svg>
      );
    case "calendario":
      return (
        <svg {...comun}>
          <rect x="3.5" y="5" width="17" height="15" rx="2" />
          <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
        </svg>
      );
    case "plantilla":
    default:
      // Piezas encajadas: algo que rellenas.
      return (
        <svg {...comun}>
          <rect x="3.5" y="4" width="17" height="6" rx="1.5" />
          <rect x="3.5" y="14" width="9" height="6" rx="1.5" />
          <path d="M15.5 17h5" />
        </svg>
      );
  }
}
