import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnPreparacion } from "@/components/layout/EnPreparacion";
import { LIBROS, obtenerLibro } from "@/lib/datos/libros";

export function generateStaticParams() {
  return LIBROS.map((libro) => ({ slug: libro.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const libro = obtenerLibro(slug);

  return {
    title: libro ? libro.titulo : "Libro",
    robots: { index: false, follow: true },
  };
}

export default async function PaginaLibro({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const libro = obtenerLibro(slug);

  if (!libro) notFound();

  return (
    <EnPreparacion
      fase="Fase 2"
      titulo={libro.titulo}
      descripcion={`${libro.gancho} La ficha completa —comparativa de formatos, índice, muestra gratuita, entregables y compra del PDF Premium— es la página más importante del sitio y se construye en la Fase 2.`}
    />
  );
}
