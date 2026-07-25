/**
 * Plantilla de las imágenes Open Graph, generadas con `next/og` en el build.
 *
 * Nota sobre la tipografía: Satori (el motor detrás de `next/og`) necesita los
 * datos binarios de la fuente, y `next/font` los guarda con nombres con hash
 * dentro de `.next`, así que no se pueden referenciar de forma fiable. Meter
 * Fraunces obligaría a versionar un TTF en `/public` o a descargarlo en cada
 * build. Como el peso de marca aquí lo llevan el color del sello y la jerarquía,
 * usamos la fuente por defecto y lo dejamos anotado por si algún día compensa.
 *
 * Todo va con estilos en línea: Satori no entiende Tailwind ni hojas externas.
 */

export const TAMANO_OG = { width: 1200, height: 630 } as const;
export const TIPO_OG = "image/png";

const HUESO = "#FAF8F3";
const TINTA = "#1A1A1A";
const TENUE = "#57534E";

interface PropsPlantillaOg {
  /** Antetítulo pequeño: sello, sección o tipo de contenido. */
  ojo: string;
  titulo: string;
  subtitulo?: string;
  /** Línea inferior: autor, precio, fecha… */
  pie?: string;
  /** Color de marca del sello, para la banda y el antetítulo. */
  color: string;
}

export function PlantillaOg({ ojo, titulo, subtitulo, pie, color }: PropsPlantillaOg) {
  // Los títulos largos bajan de tamaño para no desbordar la tarjeta.
  const tamanoTitulo = titulo.length > 62 ? 54 : titulo.length > 42 ? 64 : 74;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: HUESO,
        padding: "68px 72px 60px",
        position: "relative",
      }}
    >
      {/* Banda del sello */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 16,
          backgroundColor: color,
          display: "flex",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color,
            fontWeight: 700,
          }}
        >
          {ojo}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: tamanoTitulo,
            lineHeight: 1.08,
            color: TINTA,
            fontWeight: 700,
            letterSpacing: -1.5,
          }}
        >
          {titulo}
        </div>

        {subtitulo ? (
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 30,
              lineHeight: 1.35,
              color: TENUE,
            }}
          >
            {subtitulo}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `2px solid ${color}33`,
          paddingTop: 26,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: TINTA,
            fontWeight: 700,
          }}
        >
          Editorial Alcedo
        </div>

        {pie ? (
          <div style={{ display: "flex", fontSize: 24, color: TENUE }}>{pie}</div>
        ) : null}
      </div>
    </div>
  );
}
