import type { Metadata } from "next";
import Link from "next/link";
import { FormularioAcceso } from "@/components/tienda/FormularioAcceso";
import { Boton, EnlaceBoton } from "@/components/ui/Boton";
import { Contenedor } from "@/components/ui/Contenedor";
import { ficherosDelProducto, obtenerProducto } from "@/lib/contenido/productos";
import { estadoActualizaciones, estadoGarantia, textoGarantia } from "@/lib/garantia";
import { cerrarSesion, regenerarDescargas } from "@/lib/tienda/acciones-cuenta";
import { modoLocal, pedidosDeEmail } from "@/lib/tienda/almacen";
import { emailDeLaSesion, hayAuthConfigurada } from "@/lib/tienda/sesion";
import { LIMITE_DESCARGAS } from "@/lib/tienda/tokens";
import { formatearFecha, formatearPrecio } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Área de cliente.
 *
 * Aquí se cumple la promesa que hace la ficha de libro: las compras no se
 * pierden, se pueden volver a descargar siempre y se ve cuántos días de garantía
 * quedan. Los plazos salen de `src/lib/garantia.ts`, el mismo módulo del que lee
 * el texto de venta.
 */
export default async function PaginaCuenta() {
  if (!hayAuthConfigurada()) {
    return (
      <Contenedor ancho="lectura" className="py-16 sm:py-24">
        <p className="ojo-titular">Área de cliente</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Mis compras</h1>
        <div className="mt-8 rounded-lg border border-dashed border-borde-fuerte bg-fondo-alterno p-5">
          <p className="text-sm leading-relaxed text-texto-tenue">
            <strong className="font-semibold text-texto">Modo local.</strong> El acceso
            por enlace mágico necesita las variables de Supabase. Mientras tanto, la
            descarga funciona con el enlace de la compra, que sirve 30 días.
          </p>
        </div>
        <EnlaceBoton href="/catalogo" className="mt-8">
          Ver el catálogo
        </EnlaceBoton>
      </Contenedor>
    );
  }

  const email = await emailDeLaSesion();

  if (!email) {
    return (
      <Contenedor ancho="lectura" className="py-16 sm:py-24">
        <p className="ojo-titular">Área de cliente</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Entrar en mi cuenta</h1>
        <p className="mt-4 text-lg leading-relaxed text-texto-tenue">
          Aquí están todas tus compras y sus descargas, siempre en la última versión.
        </p>
        <div className="mt-8">
          <FormularioAcceso />
        </div>
      </Contenedor>
    );
  }

  const pedidos = await pedidosDeEmail(email);

  return (
    <Contenedor className="py-12 sm:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="ojo-titular">Área de cliente</p>
          <h1 className="mt-3 text-3xl sm:text-4xl">Mis compras</h1>
          <p className="mt-2 text-sm text-texto-tenue">{email}</p>
        </div>

        <form action={cerrarSesion}>
          <Boton type="submit" variante="secundario" tamano="sm">
            Cerrar sesión
          </Boton>
        </form>
      </div>

      {pedidos.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-borde-fuerte p-10 text-center">
          <p className="font-titulares text-xl text-texto">Aquí no hay nada todavía</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-texto-tenue">
            No encontramos compras con este correo. Si compraste con otra dirección,
            entra con esa. {modoLocal() ? "(Estás en modo local.)" : ""}
          </p>
          <EnlaceBoton href="/catalogo" className="mt-6">
            Ver el catálogo
          </EnlaceBoton>
        </div>
      ) : (
        <ul className="mt-10 flex flex-col gap-6">
          {pedidos.map((pedido) => {
            const producto = obtenerProducto(pedido.sku);
            const ficheros = producto ? ficherosDelProducto(producto) : [];
            const garantia = estadoGarantia(new Date(pedido.pagadoEn));
            const actualizaciones = estadoActualizaciones(new Date(pedido.pagadoEn));
            const restantes = Math.max(LIMITE_DESCARGAS - pedido.descargasUsadas, 0);

            return (
              <li key={pedido.id}>
                <article className="rounded-lg border border-borde bg-superficie p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-xl">{producto?.titulo ?? pedido.sku}</h2>
                      <p className="mt-1 text-sm text-texto-tenue">
                        {formatearFecha(pedido.pagadoEn.slice(0, 10))} ·{" "}
                        {formatearPrecio(pedido.importeCentimos / 100)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-xs">
                      <span
                        className={
                          garantia.vigente
                            ? "rounded-full bg-marca-suave px-2.5 py-1 font-medium text-marca-texto"
                            : "rounded-full border border-borde px-2.5 py-1 text-texto-tenue"
                        }
                      >
                        {textoGarantia(garantia)}
                      </span>
                      <span className="text-texto-tenue">
                        {actualizaciones.vigente
                          ? `Actualizaciones ${actualizaciones.diasRestantes} días más`
                          : "Actualizaciones vencidas"}
                      </span>
                    </div>
                  </div>

                  {ficheros.length > 0 ? (
                    <ul className="mt-5 divide-y divide-borde border-y border-borde">
                      {ficheros.map((fichero) => (
                        <li
                          key={fichero.ruta}
                          className="flex flex-wrap items-center justify-between gap-3 py-3"
                        >
                          <span className="min-w-0">
                            <span className="block text-[0.9375rem] text-texto">
                              {fichero.nombre}
                            </span>
                            <span className="text-xs text-texto-tenue">
                              Versión {fichero.version} · actualizado el{" "}
                              {formatearFecha(fichero.actualizado)}
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
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-texto-tenue">
                      Te quedan {restantes} de {LIMITE_DESCARGAS} descargas con el
                      enlace actual.
                    </p>

                    <form action={regenerarDescargas}>
                      <input type="hidden" name="pedido" value={pedido.id} />
                      <Boton type="submit" variante="fantasma" tamano="sm">
                        Generar enlace nuevo
                      </Boton>
                    </form>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-10 text-sm text-texto-tenue">
        ¿Algún problema con una descarga?{" "}
        <Link href="/contacto" className="underline hover:text-marca-texto">
          Escríbenos
        </Link>{" "}
        y lo resolvemos.
      </p>
    </Contenedor>
  );
}
