import type { Metadata } from "next";
import { EnPreparacion } from "@/components/layout/EnPreparacion";

export const metadata: Metadata = {
  title: "Sobre Alcedo",
  robots: { index: false, follow: true },
};

export default function PaginaSobreAlcedo() {
  return (
    <EnPreparacion
      fase="Fase 2"
      titulo="Sobre Alcedo"
      descripcion="Quién está detrás de la editorial, de dónde viene el nombre (Alcedo atthis, el martín pescador) y cómo elegimos qué publicar."
    />
  );
}
