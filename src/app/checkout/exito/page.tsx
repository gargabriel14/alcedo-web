import type { Metadata } from "next";
import Link from "next/link";
import { obtenerLibro } from "@/lib/contenido/libros";
import { ficherosDelProducto, obtenerProducto } from "@/lib/contenido/productos";
import { EnlaceBoton } from "@/components/ui/Boton";
import { Contenedor } from "@/components/ui/Contenedor";
import { DIAS_GARANTIA, estadoGarantia, MESES_ACTUALIZACION } from "@/lib/garantia";
import { pedidoPorReferencia } from "@/lib/tienda/almacen";
import { LIMITE_DESCARGAS } from "@/lib/tienda/tokens";
import { formatearPrecio } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Gracias por tu compra",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Oculta el correo salvo las dos primeras letras: `ga****@gmail.com`. */
function enmascarar(email: string): string {
  const [usuario = "", dominio = ""] = email.split("@");
  const visible = usuario.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(usuario.length - 2, 2))}@${dominio}`;
}

/**
 * Post-compra.
 *
 * **La descarga está aquí, no en el correo.** El momento de máxima confianza es
 * justo después de pagar; si en ese instante le dices al comprador que mire su
 * bandeja de entrada, pierdes a quien tiene el correo en otro dispositivo y
 * ganas un correo de soporte. El email se manda igual, pero como copia de
 * seguridad, no como entrega.
 */
export default async function PaginaExito({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const pedido = ref ? await pedidoPorReferencia(ref) : null;

  if (!pedido) {
    return (
      <Contenedor ancho="lectura" className="py-20 sm:py-28">
        <p className="ojo-titular">No encontramos ese pedido</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Aquí falta algo</h1>
        <p className="mt-5 text-lg leading-relaxed text-texto-tenue">
          Puede que el pago aún se esté confirmando: espera un minuto y recarga. Si
          acabas de pagar y esto sigue igual, entra en tu cuenta con el correo de la
          compra o escríbenos: tu pedido existe aunque esta página no lo vea.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <EnlaceBoton href="/cuenta">Ir a mi cuenta</EnlaceBoton>
          <EnlaceBoton href="/contacto" variante="secundario">
            Escribirnos
          </EnlaceBoton>
        </div>
      </Contenedor>
    );
  }

  const producto = obtenerProducto(pedido.sku);
  const ficheros = producto ? ficherosDelProducto(producto) : [];
  const libro = producto?.libroRelacionado
    ? obtenerLibro(producto.libroRelacionado)
    : undefined;
  const garantia = estadoGarantia(new Date(pedido.pagadoEn));
  const restantes = Math.max(LIMITE_DESCARGAS - pedido.descargasUsadas, 0);

  return (
    <Contenedor ancho="lectura" className="py-14 sm:py-20">
      <p className="ojo-titular">Pago completado</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">Gracias. Descárgalo ya</h1>
      <p className="mt-4 text-lg leading-relaxed text-texto-tenue">
        <strong className="text-texto">{producto?.titulo ?? pedido.sku}</strong> por{" "}
        {formatearPrecio(pedido.importeCentimos / 100)}. También te lo hemos mandado a{" "}
        {enmascarar(pedido.email)}, pero no hace falta que esperes al correo.
      </p>

      <section aria-labelledby="titulo-descargas" className="mt-10">
        <h2 id="titulo-descargas" className="text-xl">
          Tus ficheros
        </h2>

        <ul className="mt-4 divide-y divide-borde overflow-hidden rounded-lg border border-borde bg-superficie">
          {ficheros.map((fichero) => (
            <li
              key={fichero.ruta}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <span className="min-w-0">
                <span className="block text-[0.9375rem] font-medium text-texto">
                  {fichero.nombre}
                </span>
                <span className="mt-0.5 block text-xs text-texto-tenue">
                  Versión {fichero.version}
                  {fichero.megas ? ` · ${fichero.megas} MB` : ""}
                </span>
              </span>

              <EnlaceBoton
                href={`/api/descargar/${pedido.tokenDescarga}?f=${encodeURIComponent(fichero.ruta)}`}
                externo
                tamano="sm"
                variante="secundario"
              >
                Descargar
              </EnlaceBoton>
            </li>
          ))}
        </ul>

        <p className="mt-3 text-xs leading-relaxed text-texto-tenue">
          Te quedan {restantes} descargas con este enlace y caduca en 30 días. Cuando
          se agote, entra en tu cuenta con este mismo correo y genera uno nuevo sin
          coste: <strong>tus compras no se pierden nunca</strong>.
        </p>
      </section>

      <section className="mt-10 rounded-lg border border-marca/30 bg-marca-suave p-5">
        <h2 className="text-lg">Lo que viene incluido</h2>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-texto-tenue">
          <li>
            <strong className="text-texto">Actualizaciones {MESES_ACTUALIZACION} meses.</strong>{" "}
            Si cambia algo del material, te avisamos y descargas la versión nueva gratis.
          </li>
          <li>
            <strong className="text-texto">Garantía de {DIAS_GARANTIA} días.</strong>{" "}
            {garantia.vigente
              ? `Te quedan ${garantia.diasRestantes} días para pedir la devolución sin dar explicaciones.`
              : "El plazo de devolución de este pedido ya ha vencido."}
          </li>
        </ul>
      </section>

      {libro ? (
        <p className="mt-10 text-sm text-texto-tenue">
          ¿Dudas con el material?{" "}
          <Link href={`/libro/${libro.slug}`} className="underline hover:text-marca-texto">
            Vuelve a la ficha del libro
          </Link>{" "}
          o{" "}
          <Link href="/contacto" className="underline hover:text-marca-texto">
            escríbenos
          </Link>
          .
        </p>
      ) : null}
    </Contenedor>
  );
}
