import { ImageResponse } from "next/og";
import { obtenerArticulo, todosLosArticulos } from "@/lib/contenido/blog";
import { obtenerSello } from "@/lib/sellos";
import { PlantillaOg, TAMANO_OG, TIPO_OG } from "@/lib/seo/og";

export const alt = "Artículo del blog de Editorial Alcedo";
export const size = TAMANO_OG;
export const contentType = TIPO_OG;

export function generateStaticParams() {
  return todosLosArticulos().map((articulo) => ({ slug: articulo.slug }));
}

export default async function ImagenOgArticulo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articulo = obtenerArticulo(slug);

  if (!articulo) {
    return new ImageResponse(
      (
        <PlantillaOg
          ojo="Blog"
          titulo="Conocimiento con puntería"
          color="#235C62"
        />
      ),
      size,
    );
  }

  const sello = obtenerSello(articulo.sello);

  return new ImageResponse(
    (
      <PlantillaOg
        ojo="Artículo"
        titulo={articulo.titulo}
        pie={`${articulo.minutos} min de lectura · ${sello.nombre}`}
        color={sello.hex}
      />
    ),
    size,
  );
}
