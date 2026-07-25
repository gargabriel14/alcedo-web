import type { Metadata } from "next";
import { EnlaceBoton } from "@/components/ui/Boton";
import { Contenedor } from "@/components/ui/Contenedor";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

export default function NoEncontrada() {
  return (
    <Contenedor ancho="lectura" className="py-20 sm:py-28">
      <p className="ojo-titular">Error 404</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Aquí no hay nada</h1>
      <p className="mt-5 text-lg leading-relaxed text-texto-tenue">
        La dirección que has abierto no existe o ha cambiado de sitio. Si has llegado
        desde un enlace impreso en uno de nuestros libros, escríbenos y lo arreglamos.
      </p>

      <div className="mt-9 flex flex-wrap gap-3">
        <EnlaceBoton href="/">Volver a la portada</EnlaceBoton>
        <EnlaceBoton href="/catalogo" variante="secundario">
          Ver el catálogo
        </EnlaceBoton>
      </div>
    </Contenedor>
  );
}
