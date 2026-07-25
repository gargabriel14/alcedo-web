/**
 * Inserta un bloque JSON-LD en el HTML.
 *
 * El contenido lo generamos nosotros en el servidor a partir de datos propios,
 * nunca de entrada del usuario, así que no hay riesgo de inyección. Aun así se
 * escapa `<` para que un título con un signo raro no pueda cerrar la etiqueta.
 */
export function DatosEstructurados({ datos }: { datos: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(datos).replace(/</g, "\\u003c"),
      }}
    />
  );
}
