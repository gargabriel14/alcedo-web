import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/mdx/Mdx";
import { Contenedor } from "@/components/ui/Contenedor";
import { esquemaLegal, type FrontmatterLegal } from "@/lib/contenido/esquemas";
import { leerColeccion } from "@/lib/contenido/mdx";
import { formatearFecha } from "@/lib/utils";

type Documento = FrontmatterLegal & { slug: string; cuerpo: string };

function documentos(): Documento[] {
  return leerColeccion("legal", esquemaLegal).map(({ slug, datos, cuerpo }) => ({
    slug,
    ...datos,
    cuerpo,
  }));
}

export function generateStaticParams() {
  return documentos().map((documento) => ({ documento: documento.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ documento: string }>;
}): Promise<Metadata> {
  const { documento } = await params;
  const encontrado = documentos().find((candidato) => candidato.slug === documento);

  if (!encontrado) return { title: "Documento no encontrado" };

  return {
    title: encontrado.titulo,
    description: encontrado.resumen,
    alternates: { canonical: `/legal/${encontrado.slug}` },
    // Los legales no aportan nada en búsquedas, pero tienen que ser accesibles
    // y enlazables: se indexan sin más pretensión.
    robots: { index: true, follow: true },
  };
}

export default async function PaginaLegal({
  params,
}: {
  params: Promise<{ documento: string }>;
}) {
  const { documento } = await params;
  const encontrado = documentos().find((candidato) => candidato.slug === documento);

  if (!encontrado) notFound();

  return (
    <Contenedor ancho="lectura" className="py-12 sm:py-16">
      <p className="ojo-titular">Información legal</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">{encontrado.titulo}</h1>
      <p className="mt-3 text-sm text-texto-tenue">
        Última revisión: {formatearFecha(encontrado.actualizado)}
      </p>

      <Mdx fuente={encontrado.cuerpo} className="mt-8" />
    </Contenedor>
  );
}
