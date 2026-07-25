import type { Metadata } from "next";
import { EnPreparacion } from "@/components/layout/EnPreparacion";

export const metadata: Metadata = {
  title: "Contacto",
  robots: { index: false, follow: true },
};

export default function PaginaContacto() {
  return (
    <EnPreparacion
      fase="Fase 3"
      titulo="Contacto"
      descripcion="El formulario de contacto se conecta cuando esté el correo transaccional. Para incidencias con una compra habrá además una dirección de soporte visible en el propio email de entrega."
    />
  );
}
