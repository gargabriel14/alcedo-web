import { z } from "zod";
import { registrarEvento, type NombreEvento } from "@/lib/tienda/almacen";

/**
 * Analítica propia.
 *
 * Un endpoint nuestro en vez de un script de terceros: sin cookies, sin
 * identificadores y sin enviar nada a nadie. Solo se aceptan nombres de evento
 * de una lista cerrada, así que ni siquiera un cliente manipulado puede llenar la
 * tabla de basura.
 *
 * Los eventos de negocio importantes (compra, descarga) los registra el servidor
 * por su cuenta. Este endpoint es solo para lo que ocurre en el navegador y no
 * pasa por nosotros, como el clic a Amazon.
 */

const esquema = z.object({
  nombre: z.enum(["click_amazon", "checkout_iniciado"]),
  propiedades: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).default({}),
});

export async function POST(peticion: Request): Promise<Response> {
  let cuerpo: unknown;

  try {
    cuerpo = await peticion.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const resultado = esquema.safeParse(cuerpo);

  if (!resultado.success) {
    return new Response(null, { status: 400 });
  }

  await registrarEvento(
    resultado.data.nombre as NombreEvento,
    resultado.data.propiedades,
  );

  // 204: no hay nada que devolver y el navegador no espera respuesta.
  return new Response(null, { status: 204 });
}
