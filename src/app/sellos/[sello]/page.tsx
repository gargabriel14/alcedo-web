import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnPreparacion } from "@/components/layout/EnPreparacion";
import { LISTA_SELLOS, SELLOS, type ClaveSello } from "@/lib/sellos";

export function generateStaticParams() {
  return LISTA_SELLOS.map((sello) => ({ sello: sello.slug }));
}

function esClaveSello(valor: string): valor is ClaveSello {
  return valor in SELLOS;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sello: string }>;
}): Promise<Metadata> {
  const { sello } = await params;

  return {
    title: esClaveSello(sello) ? SELLOS[sello].nombre : "Sello",
    robots: { index: false, follow: true },
  };
}

export default async function PaginaSello({
  params,
}: {
  params: Promise<{ sello: string }>;
}) {
  const { sello } = await params;

  if (!esClaveSello(sello)) notFound();

  const datos = SELLOS[sello];

  return (
    <EnPreparacion
      fase="Fase 2"
      titulo={datos.nombre}
      descripcion={`${datos.descripcion} La landing del sello, con sus libros filtrados y su cabecera de color, llega en la Fase 2.`}
    />
  );
}
