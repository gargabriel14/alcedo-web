import type { Metadata } from "next";
import { EnPreparacion } from "@/components/layout/EnPreparacion";

export const metadata: Metadata = {
  title: "Catálogo",
  robots: { index: false, follow: true },
};

export default function PaginaCatalogo() {
  return (
    <EnPreparacion
      fase="Fase 2"
      titulo="Catálogo"
      descripcion="Aquí estará el catálogo completo con filtros por sello, tema y formato, alimentado desde los ficheros MDX del repositorio. Mientras llega, los tres títulos están en la portada."
    />
  );
}
