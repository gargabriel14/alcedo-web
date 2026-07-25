import type { Metadata } from "next";
import { EnPreparacion } from "@/components/layout/EnPreparacion";

export const metadata: Metadata = {
  title: "Blog",
  robots: { index: false, follow: true },
};

export default function PaginaBlog() {
  return (
    <EnPreparacion
      fase="Fase 2"
      titulo="Blog"
      descripcion="Artículos prácticos que resuelven una duda concreta y llevan al libro que la desarrolla entera. Es el motor de tráfico orgánico del sitio."
    />
  );
}
