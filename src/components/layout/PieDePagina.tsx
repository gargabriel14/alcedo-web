import Link from "next/link";
import { Logo } from "@/components/marca/Logo";
import { Contenedor } from "@/components/ui/Contenedor";
import { LISTA_SELLOS } from "@/lib/sellos";
import {
  NAVEGACION_EDITORIAL,
  NAVEGACION_LEGAL,
  NAVEGACION_PRINCIPAL,
  SITIO,
} from "@/lib/sitio";

export function PieDePagina() {
  const anio = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-borde bg-fondo-alterno">
      <Contenedor className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-texto-tenue">
              {SITIO.propuesta} Publicamos bajo tres sellos y vendemos también en
              Amazon, pero es aquí donde el libro viene con sus plantillas.
            </p>
          </div>

          <ColumnaPie titulo="Catálogo">
            {LISTA_SELLOS.map((sello) => (
              <EnlacePie key={sello.slug} ruta={`/sellos/${sello.slug}`}>
                {sello.nombre}
              </EnlacePie>
            ))}
            {NAVEGACION_PRINCIPAL.filter((e) => e.ruta !== "/sobre-alcedo").map(
              (enlace) => (
                <EnlacePie key={enlace.ruta} ruta={enlace.ruta}>
                  {enlace.nombre}
                </EnlacePie>
              ),
            )}
          </ColumnaPie>

          <ColumnaPie titulo="Editorial">
            <EnlacePie ruta="/sobre-alcedo">Sobre Alcedo</EnlacePie>
            {NAVEGACION_EDITORIAL.map((enlace) => (
              <EnlacePie key={enlace.ruta} ruta={enlace.ruta}>
                {enlace.nombre}
              </EnlacePie>
            ))}
            <EnlacePie ruta="/cuenta">Mis compras</EnlacePie>
          </ColumnaPie>

          <ColumnaPie titulo="Legal">
            {NAVEGACION_LEGAL.map((enlace) => (
              <EnlacePie key={enlace.ruta} ruta={enlace.ruta}>
                {enlace.nombre}
              </EnlacePie>
            ))}
            <EnlacePie ruta="/legal/terminos#reembolsos">
              Política de reembolso
            </EnlacePie>
          </ColumnaPie>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-borde pt-6 text-xs text-texto-tenue sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {anio} Editorial Alcedo · [[RAZÓN SOCIAL]] · NIF [[NIF]] ·
            [[DIRECCIÓN]]
          </p>
          <p>
            «{SITIO.claim}» · Editorial independiente en España · Alcedo atthis
          </p>
        </div>
      </Contenedor>
    </footer>
  );
}

function ColumnaPie({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="ojo-titular mb-4">{titulo}</h2>
      <ul className="flex flex-col gap-2.5 text-sm">{children}</ul>
    </div>
  );
}

function EnlacePie({ ruta, children }: { ruta: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={ruta} className="text-texto-tenue transition-colors hover:text-marca-texto">
        {children}
      </Link>
    </li>
  );
}
