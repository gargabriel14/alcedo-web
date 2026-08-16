import type { Metadata } from "next";
import { CompromisoAlcedo } from "@/components/home/CompromisoAlcedo";
import { Hero } from "@/components/home/Hero";
import { Manifiesto } from "@/components/home/Manifiesto";
import { Testimonios } from "@/components/home/Testimonios";
import { TresSellos } from "@/components/home/TresSellos";
import { UltimasPublicaciones } from "@/components/home/UltimasPublicaciones";
import { Cinta } from "@/components/ui/Cinta";

export const metadata: Metadata = {
  // 152 caracteres, frase completa: cabe en lo que Google muestra y no termina
  // cortada a medias.
  description:
    "Guías prácticas ilustradas con plantillas listas para usar: Excel e IA para autónomos, hogar y naturaleza. Descarga gratis la plantilla del IVA trimestral.",
  alternates: { canonical: "/" },
};

/** TODO(contenido): mensajes de la cinta, a revisar en cada lanzamiento. */
const MENSAJES_CINTA = [
  "Plantillas editables incluidas",
  "Descarga inmediata al comprar",
  "Actualizaciones gratis 12 meses",
  "Garantía de devolución de 14 días",
  "También en Amazon, en Kindle y tapa blanda",
] as const;

export default function PaginaInicio() {
  return (
    <>
      <Hero />
      <Cinta mensajes={MENSAJES_CINTA} />
      <TresSellos />
      <UltimasPublicaciones />
      <Manifiesto />
      <Testimonios />
      <CompromisoAlcedo />
    </>
  );
}
