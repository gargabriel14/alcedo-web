import type { Metadata } from "next";
import { EnPreparacion } from "@/components/layout/EnPreparacion";

export const metadata: Metadata = {
  title: "Autores",
  robots: { index: false, follow: true },
};

export default function PaginaAutores() {
  return (
    <EnPreparacion
      fase="Fase 2"
      titulo="Autores"
      descripcion="La ficha de G. G. Alcedo y, más adelante, la de los autores que publiquen con el sello Alcedo Autores."
    />
  );
}
