import { ficherosDelProducto, obtenerProducto } from "@/lib/contenido/productos";
import {
  anotarDescarga,
  modoLocal,
  pedidoPorToken,
  registrarEvento,
  urlFirmadaDeFichero,
} from "@/lib/tienda/almacen";

/**
 * Entrega de un fichero comprado.
 *
 * Comprueba, en este orden: que el token existe, que no ha caducado, que el
 * fichero pertenece a lo que se compró y que no se ha agotado el límite de
 * descargas. Solo entonces pide a Supabase una URL firmada de 24 horas y redirige.
 *
 * El fichero nunca pasa por nuestro servidor: eso ahorra ancho de banda (y en
 * Vercel Hobby, ese es justo el recurso escaso) y evita que una descarga de
 * 40 MB agote el tiempo de la función.
 */
export async function GET(
  peticion: Request,
  { params }: { params: Promise<{ token: string }> },
): Promise<Response> {
  const { token } = await params;
  const rutaPedida = new URL(peticion.url).searchParams.get("f");

  const pedido = await pedidoPorToken(token);

  if (!pedido) {
    return respuesta(
      404,
      "Este enlace de descarga no existe. Si compraste el libro, entra en tu cuenta y genera uno nuevo.",
    );
  }

  if (new Date(pedido.tokenExpiraEn) < new Date()) {
    return respuesta(
      410,
      "Este enlace ha caducado. Entra en tu cuenta con el correo de la compra y genera uno nuevo: tus descargas no se pierden nunca.",
    );
  }

  const producto = obtenerProducto(pedido.sku);
  if (!producto) {
    return respuesta(500, "No encontramos el producto de este pedido. Escríbenos y lo arreglamos.");
  }

  const ficheros = ficherosDelProducto(producto);
  const fichero = rutaPedida
    ? ficheros.find((candidato) => candidato.ruta === rutaPedida)
    : ficheros[0];

  if (!fichero) {
    return respuesta(404, "Ese fichero no forma parte de tu compra.");
  }

  const control = await anotarDescarga(pedido, fichero.ruta, fichero.version);

  if (!control.permitida) {
    return respuesta(
      429,
      `Has llegado al límite de ${control.limite} descargas con este enlace. Entra en tu cuenta con el correo de la compra y genera uno nuevo, sin coste.`,
    );
  }

  await registrarEvento("descarga", {
    sku: pedido.sku,
    fichero: fichero.ruta,
    version: fichero.version,
    numero: control.usadas,
  });

  const firmada = await urlFirmadaDeFichero(fichero.ruta);

  if (!firmada) {
    return respuesta(
      200,
      [
        modoLocal()
          ? "MODO LOCAL: no hay Supabase configurado, así que no hay fichero que servir."
          : "El fichero todavía no está subido al almacenamiento.",
        "",
        `Fichero:  ${fichero.nombre}`,
        `Ruta:     ${fichero.ruta}`,
        `Versión:  ${fichero.version}`,
        `Descarga: ${control.usadas} de ${control.limite}`,
        "",
        "En producción, aquí habría una redirección a una URL firmada de 24 horas.",
      ].join("\n"),
    );
  }

  // 302 y no 301: la URL firmada caduca, así que no debe cachearse nunca.
  return Response.redirect(firmada, 302);
}

function respuesta(estado: number, mensaje: string): Response {
  return new Response(mensaje, {
    status: estado,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
