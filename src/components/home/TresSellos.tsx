import Link from "next/link";
import { Contenedor } from "@/components/ui/Contenedor";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { LISTA_SELLOS } from "@/lib/sellos";

export function TresSellos() {
  return (
    <section aria-labelledby="titulo-sellos" className="py-16 sm:py-20">
      <Contenedor>
        <TituloSeccion
          id="titulo-sellos"
          ojo="Tres sellos"
          titulo="Cada colección, un oficio"
          entrada="Publicamos poco y muy dirigido. Si un libro no cabe en uno de estos tres sellos, no lo hacemos."
        />

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {LISTA_SELLOS.map((sello) => (
            <li key={sello.slug} className="group relative flex">
              <div className="flex flex-col overflow-hidden rounded-lg border border-borde bg-superficie transition-shadow hover:shadow-tarjeta">
                <span aria-hidden="true" className={`h-1.5 w-full ${sello.clases.solido}`} />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl">
                    <Link href={`/sellos/${sello.slug}`} className="hover:text-marca-texto">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {sello.nombre}
                    </Link>
                  </h3>
                  <p className={`mt-1.5 text-sm font-semibold ${sello.clases.texto}`}>
                    {sello.lema}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-texto-tenue">
                    {sello.descripcion}
                  </p>
                  <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-marca-texto">
                    Ver los libros del sello
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}
