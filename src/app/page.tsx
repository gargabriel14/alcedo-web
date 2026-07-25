import type { Metadata } from "next";
import { CompromisoAlcedo } from "@/components/home/CompromisoAlcedo";
import { Hero } from "@/components/home/Hero";
import { Testimonios } from "@/components/home/Testimonios";
import { TresSellos } from "@/components/home/TresSellos";
import { UltimasPublicaciones } from "@/components/home/UltimasPublicaciones";

export const metadata: Metadata = {
  // El título por defecto del layout ya es el bueno para la portada.
  description:
    "Guías prácticas ilustradas de no-ficción con plantillas listas para usar: Excel e IA para autónomos, hogar y naturaleza. Descarga gratis la plantilla de IVA trimestral.",
  alternates: { canonical: "/" },
};

export default function PaginaInicio() {
  return (
    <>
      <Hero />
      <TresSellos />
      <UltimasPublicaciones />
      <Testimonios />
      <CompromisoAlcedo />
    </>
  );
}
