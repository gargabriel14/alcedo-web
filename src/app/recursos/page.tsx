import type { Metadata } from "next";
import { EnPreparacion } from "@/components/layout/EnPreparacion";

export const metadata: Metadata = {
  title: "Recursos gratis",
  robots: { index: false, follow: true },
};

export default function PaginaRecursos() {
  return (
    <EnPreparacion
      fase="Fase 3"
      titulo="Recursos gratis"
      descripcion="La biblioteca de plantillas y guías descargables, cada una con su propia página de descarga y confirmación por correo. La primera, la plantilla de IVA trimestral, ya se puede pedir desde la portada."
    />
  );
}
