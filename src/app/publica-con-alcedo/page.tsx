import type { Metadata } from "next";
import Link from "next/link";
import { FormularioPropuesta } from "@/components/formularios/FormularioPropuesta";
import { DatosEstructurados } from "@/components/seo/DatosEstructurados";
import { Contenedor } from "@/components/ui/Contenedor";
import { grafoJsonLd, migasJsonLd } from "@/lib/seo/jsonLd";

export const metadata: Metadata = {
  title: "Publica con Alcedo",
  description:
    "Buscamos autores que sepan hacer algo y sepan explicarlo. Editorial Alcedo se encarga de la edición, el diseño, la venta y el marketing. Cuéntanos tu propuesta.",
  alternates: { canonical: "/publica-con-alcedo" },
  openGraph: {
    title: "Publica con Editorial Alcedo",
    description:
      "Sello abierto a autores de no-ficción práctica. Tú sabes hacerlo; nosotros lo convertimos en libro.",
    url: "/publica-con-alcedo",
  },
};

const LO_QUE_PONEMOS = [
  {
    titulo: "Edición de verdad",
    texto:
      "Trabajamos el índice contigo antes de que escribas una línea, y luego revisamos capítulo a capítulo. La regla es la misma que aplicamos a los nuestros: si no cambia nada en la semana del lector, se cae.",
  },
  {
    titulo: "Diseño e ilustración",
    texto:
      "Portada, interior maquetado y las ilustraciones que haga falta. Tú no tocas ni una plantilla de diseño.",
  },
  {
    titulo: "Venta en los tres canales",
    texto:
      "Amazon en Kindle y tapa blanda, y el PDF Premium con los ficheros descargables en nuestra web, que es donde está el margen.",
  },
  {
    titulo: "Marketing orgánico",
    texto:
      "Vídeo vertical, artículos que posicionan y la lista de correo de la editorial. Sin presupuesto de publicidad, porque no hace falta.",
  },
];

const LO_QUE_PEDIMOS = [
  "Que sepas hacer lo que vas a enseñar, y que ya se lo hayas explicado a alguien.",
  "Un tema con un resultado concreto: no «productividad», sino «cerrar el trimestre en una tarde».",
  "Al menos un entregable útil de verdad: una plantilla, un calendario, un sistema.",
  "Constancia para escribir 150 páginas buenas antes que 400 rellenas.",
];

export default function PaginaPublicaConAlcedo() {
  return (
    <>
      <section className="border-b border-borde bg-fondo-alterno">
        <Contenedor className="py-12 sm:py-16">
          <p className="ojo-titular">Alcedo Autores</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-[1.05] sm:text-5xl">
            Tú sabes hacerlo. Nosotros lo convertimos en libro
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-texto-tenue">
            Abrimos el catálogo a autores de no-ficción práctica. Buscamos gente que
            haya resuelto un problema concreto en su oficio y quiera enseñar a hacerlo,
            no a escritores buscando tema.
          </p>
        </Contenedor>
      </section>

      <Contenedor className="py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_26rem] lg:gap-16">
          <div className="min-w-0">
            <section aria-labelledby="titulo-ponemos">
              <h2 id="titulo-ponemos" className="text-2xl sm:text-3xl">
                Lo que ponemos nosotros
              </h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                {LO_QUE_PONEMOS.map((bloque) => (
                  <li
                    key={bloque.titulo}
                    className="rounded-lg border border-borde bg-superficie p-5"
                  >
                    <h3 className="text-lg leading-snug">{bloque.titulo}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-texto-tenue">
                      {bloque.texto}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="titulo-pedimos" className="mt-12">
              <h2 id="titulo-pedimos" className="text-2xl sm:text-3xl">
                Lo que pedimos
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
                {LO_QUE_PEDIMOS.map((linea) => (
                  <li key={linea} className="flex gap-3">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-1 size-4 shrink-0 text-marca"
                    >
                      <path d="m4 10.5 4 4 8-9" />
                    </svg>
                    <span className="text-[0.9375rem] leading-relaxed text-texto">
                      {linea}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="titulo-condiciones" className="mt-12">
              <h2 id="titulo-condiciones" className="text-2xl sm:text-3xl">
                Cómo funciona el reparto
              </h2>
              <p className="mt-4 max-w-medida leading-relaxed text-texto-tenue">
                Las condiciones económicas se acuerdan por escrito antes de empezar y se
                explican con números concretos: cuánto deja cada canal, qué porcentaje te
                corresponde y cuándo se liquida.
              </p>
              <p className="mt-3 max-w-medida leading-relaxed text-texto-tenue">
                {/* TODO(contenido): sustituir por el reparto real cuando se cierre el
                    modelo de Alcedo Autores. Aquí no se promete ninguna cifra hasta
                    que exista un contrato que la sostenga. */}
                No publicamos porcentajes en esta página porque dependen del formato y
                del trabajo editorial que necesite cada libro. Lo hablamos en la primera
                conversación, sin rodeos.
              </p>
            </section>

            <section aria-labelledby="titulo-proceso" className="mt-12">
              <h2 id="titulo-proceso" className="text-2xl sm:text-3xl">
                Qué pasa después de enviar
              </h2>
              <ol className="mt-5 flex flex-col gap-4">
                {[
                  "Lo leemos entero. Siempre, y lo lee una persona.",
                  "Si encaja, te escribimos en menos de dos semanas para hablar del enfoque.",
                  "Trabajamos juntos el índice y una muestra de un capítulo.",
                  "Si los dos lo vemos, firmamos y empieza la producción.",
                ].map((paso, indice) => (
                  <li key={paso} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-marca/40 bg-marca-suave font-titulares text-sm font-semibold text-marca-texto"
                    >
                      {indice + 1}
                    </span>
                    <span className="text-[0.9375rem] leading-relaxed text-texto">
                      {paso}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-sm text-texto-tenue">
                Y si no encaja, también te contestamos. Un «no» rápido vale más que un
                silencio de tres meses.
              </p>
            </section>
          </div>

          <div className="lg:sticky lg:top-24">
            <h2 className="text-2xl">Cuéntanos tu propuesta</h2>
            <p className="mt-2 text-sm leading-relaxed text-texto-tenue">
              Cuatro campos. No hace falta manuscrito ni currículum.
            </p>
            <div className="relative mt-5">
              <FormularioPropuesta />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-texto-tenue">
              Usamos tus datos solo para responderte a esta propuesta.{" "}
              <Link href="/legal/privacidad" className="underline hover:text-marca-texto">
                Cómo tratamos tus datos
              </Link>
              .
            </p>
          </div>
        </div>
      </Contenedor>

      <DatosEstructurados
        datos={grafoJsonLd(
          migasJsonLd([
            { nombre: "Inicio", ruta: "/" },
            { nombre: "Publica con Alcedo", ruta: "/publica-con-alcedo" },
          ]),
        )}
      />
    </>
  );
}
