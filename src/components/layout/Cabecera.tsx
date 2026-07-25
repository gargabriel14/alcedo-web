import Link from "next/link";
import { ConmutadorTema } from "@/components/layout/ConmutadorTema";
import { MenuMovil } from "@/components/layout/MenuMovil";
import { Logo } from "@/components/marca/Logo";
import { EnlaceBoton } from "@/components/ui/Boton";
import { Contenedor } from "@/components/ui/Contenedor";
import { NAVEGACION_PRINCIPAL } from "@/lib/sitio";

export function Cabecera() {
  return (
    <header className="sticky top-0 z-40 border-b border-borde bg-fondo/85 backdrop-blur-md">
      <Contenedor className="flex h-16 items-center justify-between gap-4">
        <Logo comoEnlace />

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAVEGACION_PRINCIPAL.map((enlace) => (
              <li key={enlace.ruta}>
                <Link
                  href={enlace.ruta}
                  className="rounded-md px-3 py-2 text-[0.9375rem] text-texto-tenue transition-colors hover:bg-superficie-tenue hover:text-texto"
                >
                  {enlace.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ConmutadorTema />
          <EnlaceBoton href="/catalogo" tamano="sm" className="hidden sm:inline-flex">
            Ver catálogo
          </EnlaceBoton>
          <MenuMovil />
        </div>
      </Contenedor>
    </header>
  );
}
