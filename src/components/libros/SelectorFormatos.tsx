import { EnlaceBoton } from "@/components/ui/Boton";
import type { Libro } from "@/lib/contenido/libros";
import { DIAS_GARANTIA, MESES_ACTUALIZACION } from "@/lib/garantia";
import { formatearPrecio } from "@/lib/utils";

/**
 * Selector de formato: el bloque que decide la venta.
 *
 * Tres tarjetas comparadas y una destacada con una razón explícita, no con un
 * adorno. El objetivo es que quien iba a comprar el Kindle de 5,99 € entienda en
 * cinco segundos qué se deja fuera, y que quien no quiera pagar 29 € encuentre
 * igualmente su opción sin sentirse expulsado.
 *
 * Los enlaces de Amazon se desactivan solos mientras no existan: un botón que
 * lleva a una página de error de Amazon cuesta más que un botón apagado.
 */
export function SelectorFormatos({ libro }: { libro: Libro }) {
  const hayKindle = Boolean(libro.amazon.kindle);
  const hayTapaBlanda = Boolean(libro.amazon.tapaBlanda && libro.precios.tapaBlanda);

  return (
    <section aria-labelledby="titulo-formatos" className="scroll-mt-24">
      <h2 id="titulo-formatos" className="text-2xl sm:text-3xl">
        Elige tu formato
      </h2>
      <p className="mt-2 text-texto-tenue">
        El mismo libro en tres sitios. La diferencia está en lo que te llevas con él.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Kindle */}
        <TarjetaFormato
          nombre="Kindle"
          precio={libro.precios.kindle}
          donde="En Amazon"
          incluye={[
            "El libro completo, en digital",
            "Lectura en móvil, tableta o e-reader",
          ]}
          excluye={["Sin las plantillas ni los ficheros editables"]}
          accion={
            hayKindle ? (
              <EnlaceBoton
                href={libro.amazon.kindle!}
                externo
                variante="secundario"
                completo
              >
                Comprar en Amazon
              </EnlaceBoton>
            ) : (
              <BotonPendiente>Próximamente en Amazon</BotonPendiente>
            )
          }
        />

        {/* PDF Premium — la opción que queremos que elija */}
        <TarjetaFormato
          id="tarjeta-pdf"
          nombre="PDF Premium"
          precio={libro.precios.pdf}
          donde="Aquí, en la editorial"
          destacada
          razon={`Mejor opción: ${libro.promesaPdf}.`}
          incluye={[
            "El libro completo en PDF, para pantalla e impresión",
            ...libro.entregables.map((entregable) => entregable.titulo),
            "Descarga inmediata al pagar",
            `Actualizaciones gratuitas ${MESES_ACTUALIZACION} meses`,
            `Garantía de devolución de ${DIAS_GARANTIA} días`,
          ]}
          accion={
            <EnlaceBoton href={`/comprar/${libro.sku}`} tamano="lg" completo>
              Comprar el PDF Premium
            </EnlaceBoton>
          }
        />

        {/* Tapa blanda */}
        <TarjetaFormato
          nombre="Tapa blanda"
          precio={libro.precios.tapaBlanda}
          donde="En Amazon"
          incluye={[
            "El libro impreso, para subrayar",
            `${libro.paginas} páginas`,
          ]}
          excluye={["Sin las plantillas ni los ficheros editables"]}
          accion={
            hayTapaBlanda ? (
              <EnlaceBoton
                href={libro.amazon.tapaBlanda!}
                externo
                variante="secundario"
                completo
              >
                Comprar en Amazon
              </EnlaceBoton>
            ) : (
              <BotonPendiente>Próximamente en Amazon</BotonPendiente>
            )
          }
        />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-texto-tenue">
        Precios con impuestos incluidos, gestionados por la pasarela de pago, que
        actúa como vendedor y emite la factura. Las compras de Amazon se cierran en
        Amazon con sus propias condiciones.
      </p>
    </section>
  );
}

interface PropsTarjetaFormato {
  id?: string;
  nombre: string;
  precio: number | undefined;
  donde: string;
  incluye: readonly string[];
  excluye?: readonly string[];
  destacada?: boolean;
  razon?: string;
  accion: React.ReactNode;
}

function TarjetaFormato({
  id,
  nombre,
  precio,
  donde,
  incluye,
  excluye = [],
  destacada = false,
  razon,
  accion,
}: PropsTarjetaFormato) {
  return (
    <div
      id={id}
      className={
        destacada
          ? "relative flex flex-col rounded-lg border-2 border-marca bg-superficie p-5 shadow-tarjeta lg:-mt-3 lg:mb-3"
          : "flex flex-col rounded-lg border border-borde bg-superficie p-5"
      }
    >
      {destacada ? (
        <span className="absolute -top-3 left-5 rounded-full bg-marca px-3 py-1 text-[0.6875rem] font-semibold tracking-wider text-marca-contraste uppercase">
          Recomendado
        </span>
      ) : null}

      <p className="ojo-titular">{donde}</p>
      <h3 className="mt-1.5 text-xl">{nombre}</h3>

      <p className="mt-2 font-titulares text-3xl font-semibold text-texto">
        {precio === undefined ? "—" : formatearPrecio(precio)}
      </p>

      {razon ? (
        <p className="mt-3 rounded-md bg-marca-suave px-3 py-2 text-sm leading-snug font-medium text-marca-texto">
          {razon}
        </p>
      ) : null}

      <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm">
        {incluye.map((linea) => (
          <li key={linea} className="flex gap-2">
            <MarcaSi />
            <span className="text-texto-tenue">{linea}</span>
          </li>
        ))}
        {excluye.map((linea) => (
          <li key={linea} className="flex gap-2">
            <MarcaNo />
            <span className="text-texto-tenue">{linea}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5">{accion}</div>
    </div>
  );
}

function BotonPendiente({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex h-11 items-center justify-center rounded-md border border-dashed border-borde-fuerte px-4 text-sm font-medium text-texto-tenue">
      {children}
    </p>
  );
}

function MarcaSi() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 size-4 shrink-0 text-marca"
    >
      <path d="m4 10.5 4 4 8-9" />
    </svg>
  );
}

function MarcaNo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="mt-0.5 size-4 shrink-0 text-texto-tenue/60"
    >
      <path d="M5 10h10" />
    </svg>
  );
}
