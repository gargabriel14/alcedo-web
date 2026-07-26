import type { Metadata } from "next";
import Link from "next/link";
import { EnlaceBoton } from "@/components/ui/Boton";
import { Contenedor } from "@/components/ui/Contenedor";
import { obtenerLibro } from "@/lib/contenido/libros";
import { enviarCorreo } from "@/lib/correo/enviar";
import { correoEntregaRecurso } from "@/lib/correo/plantillas";
import { obtenerRecurso } from "@/lib/datos/recursos";
import {
  confirmarSuscriptor,
  modoLocal,
  registrarEvento,
  urlFirmadaDeFichero,
} from "@/lib/tienda/almacen";

export const metadata: Metadata = {
  title: "Confirmar tu correo",
  robots: { index: false, follow: false },
};

/** Cada token es distinto y confirma un alta: nada que cachear. */
export const dynamic = "force-dynamic";

/**
 * Segundo paso del doble opt-in.
 *
 * Confirma el correo y **entrega el fichero aquí mismo**, sin obligar a volver a
 * la bandeja de entrada. El correo con el enlace se manda igualmente, porque el
 * lector querrá recuperarlo dentro de tres semanas.
 */
export default async function PaginaConfirmar({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const suscriptor = await confirmarSuscriptor(token);

  if (!suscriptor) {
    return (
      <Contenedor ancho="lectura" className="py-20 sm:py-28">
        <p className="ojo-titular">Enlace no válido</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Este enlace ya no sirve</h1>
        <p className="mt-5 text-lg leading-relaxed text-texto-tenue">
          O bien ha caducado (duran 48 horas), o bien ya lo habías usado. Pide el
          recurso otra vez y te mandamos uno nuevo al momento.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <EnlaceBoton href="/recursos">Ver los recursos gratuitos</EnlaceBoton>
          <EnlaceBoton href="/" variante="secundario">
            Volver a la portada
          </EnlaceBoton>
        </div>
      </Contenedor>
    );
  }

  const recurso = suscriptor.recurso ? obtenerRecurso(suscriptor.recurso) : undefined;
  const libro = recurso ? obtenerLibro(recurso.libroRelacionado) : undefined;

  const url = recurso ? await urlFirmadaDeFichero(recurso.fichero.ruta) : null;

  if (recurso && url) {
    // El correo va aparte de la descarga en pantalla: si Resend falla, el lector
    // ya tiene su fichero delante.
    await enviarCorreo(correoEntregaRecurso(suscriptor.email, recurso.titulo, url));
  }

  await registrarEvento("lead_captado", {
    recurso: recurso?.slug ?? null,
    confirmado: true,
  });

  return (
    <Contenedor ancho="lectura" className="py-16 sm:py-24">
      <p className="ojo-titular">Correo confirmado</p>
      <h1 className="mt-3 text-3xl sm:text-4xl">
        {recurso ? "Aquí tienes tu descarga" : "Listo, ya estás dentro"}
      </h1>

      {recurso ? (
        <>
          <p className="mt-5 text-lg leading-relaxed text-texto-tenue">
            <strong className="text-texto">{recurso.titulo}</strong>. También te la
            hemos mandado por correo, por si la necesitas dentro de un mes.
          </p>

          {url ? (
            <EnlaceBoton href={url} externo tamano="lg" className="mt-8">
              Descargar {recurso.fichero.nombre}
            </EnlaceBoton>
          ) : (
            <p className="mt-8 rounded-lg border border-dashed border-borde-fuerte bg-fondo-alterno p-5 text-sm leading-relaxed text-texto-tenue">
              <strong className="font-semibold text-texto">
                {modoLocal() ? "Modo local:" : "Fichero pendiente de subir:"}
              </strong>{" "}
              aquí aparecería el botón de descarga de{" "}
              <code className="rounded border border-borde bg-superficie px-1 py-0.5 text-[0.85em]">
                {recurso.fichero.ruta}
              </code>
              , con una URL firmada válida 24 horas.
            </p>
          )}

          {libro ? (
            <div className="mt-12 rounded-lg border border-borde bg-superficie p-5 sm:p-6">
              <p className="ojo-titular">Si esto te sirve</p>
              <h2 className="mt-2 text-xl">{libro.titulo}</h2>
              <p className="mt-2 text-sm leading-relaxed text-texto-tenue">
                {libro.subtitulo}. {libro.promesaPdf.charAt(0).toUpperCase()}
                {libro.promesaPdf.slice(1)}.
              </p>
              <EnlaceBoton
                href={`/libro/${libro.slug}`}
                variante="secundario"
                className="mt-4"
              >
                Ver el libro
              </EnlaceBoton>
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-5 text-lg leading-relaxed text-texto-tenue">
          Tu correo está confirmado. Te escribiremos cuando publiquemos algo que te
          sirva.
        </p>
      )}

      <p className="mt-10 text-sm text-texto-tenue">
        Puedes darte de baja desde cualquier correo nuestro.{" "}
        <Link href="/legal/privacidad" className="underline hover:text-marca-texto">
          Cómo tratamos tus datos
        </Link>
        .
      </p>
    </Contenedor>
  );
}
