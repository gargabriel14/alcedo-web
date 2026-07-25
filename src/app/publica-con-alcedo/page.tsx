import type { Metadata } from "next";
import { EnPreparacion } from "@/components/layout/EnPreparacion";

export const metadata: Metadata = {
  title: "Publica con Alcedo",
  robots: { index: false, follow: true },
};

export default function PaginaPublicaConAlcedo() {
  return (
    <EnPreparacion
      fase="Fase 4"
      titulo="Publica con Alcedo"
      descripcion="La captación de autores externos para el sello Alcedo Autores llega al final del plan: primero hay que demostrar que la editorial vende, y esa prueba es el argumento de esta página."
    />
  );
}
