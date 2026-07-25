import { TarjetaLibro } from "@/components/libros/TarjetaLibro";
import { Contenedor } from "@/components/ui/Contenedor";
import { TituloSeccion } from "@/components/ui/TituloSeccion";
import { todosLosLibros } from "@/lib/contenido/libros";
import { aTarjeta } from "@/lib/contenido/tarjeta";

export function UltimasPublicaciones() {
  const libros = todosLosLibros().slice(0, 3).map(aTarjeta);

  return (
    <section
      aria-labelledby="titulo-publicaciones"
      className="border-y border-borde bg-fondo-alterno py-16 sm:py-20"
    >
      <Contenedor>
        <TituloSeccion
          id="titulo-publicaciones"
          ojo="Catálogo"
          titulo="Últimas publicaciones"
          entrada="Lo recién salido y lo que está en imprenta. El PDF Premium siempre incluye las plantillas; el Kindle, no."
          enlace={{ texto: "Ver el catálogo completo", ruta: "/catalogo" }}
        />

        <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {libros.map((libro) => (
            <li key={libro.slug} className="flex">
              <TarjetaLibro libro={libro} />
            </li>
          ))}
        </ul>
      </Contenedor>
    </section>
  );
}
