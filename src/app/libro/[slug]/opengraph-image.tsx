import { ImageResponse } from "next/og";
import { obtenerLibro, todosLosLibros } from "@/lib/contenido/libros";
import { obtenerSello } from "@/lib/sellos";
import { PlantillaOg, TAMANO_OG, TIPO_OG } from "@/lib/seo/og";
import { formatearPrecio } from "@/lib/utils";

export const alt = "Ficha del libro en Editorial Alcedo";
export const size = TAMANO_OG;
export const contentType = TIPO_OG;

export function generateStaticParams() {
  return todosLosLibros().map((libro) => ({ slug: libro.slug }));
}

export default async function ImagenOgLibro({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const libro = obtenerLibro(slug);

  if (!libro) {
    return new ImageResponse(
      (
        <PlantillaOg
          ojo="Editorial Alcedo"
          titulo="Conocimiento con puntería"
          color="#0E7C9B"
        />
      ),
      size,
    );
  }

  const sello = obtenerSello(libro.sello);

  return new ImageResponse(
    (
      <PlantillaOg
        ojo={sello.nombre}
        titulo={libro.titulo}
        subtitulo={libro.subtitulo}
        pie={`${libro.autorNombre} · PDF Premium ${formatearPrecio(libro.precios.pdf)}`}
        color={sello.hex}
      />
    ),
    size,
  );
}
