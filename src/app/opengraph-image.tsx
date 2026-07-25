import { ImageResponse } from "next/og";
import { PlantillaOg, TAMANO_OG, TIPO_OG } from "@/lib/seo/og";
import { SITIO } from "@/lib/sitio";

export const alt = `${SITIO.nombre} — ${SITIO.claim}`;
export const size = TAMANO_OG;
export const contentType = TIPO_OG;

/** Imagen por defecto del sitio: la que se ve al compartir la portada. */
export default function ImagenOgSitio() {
  return new ImageResponse(
    (
      <PlantillaOg
        ojo="Editorial independiente"
        titulo={SITIO.claim}
        subtitulo={SITIO.propuesta}
        pie="alcedo · no-ficción práctica ilustrada"
        color="#0E7C9B"
      />
    ),
    size,
  );
}
