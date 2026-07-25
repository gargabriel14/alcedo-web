import type { Metadata } from "next";
import { EnPreparacion } from "@/components/layout/EnPreparacion";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

export default function PaginaCuenta() {
  return (
    <EnPreparacion
      fase="Fase 3"
      titulo="Mi cuenta"
      descripcion="El área de cliente con tus compras y tus descargas, con acceso por enlace mágico al correo. Incluirá la re-descarga de la última versión de cada libro que hayas comprado."
    />
  );
}
