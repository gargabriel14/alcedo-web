import Image from "next/image";
import type { LibroTarjeta } from "@/lib/contenido/tarjeta";
import { obtenerSello } from "@/lib/sellos";
import { cn } from "@/lib/utils";

interface PropsPortadaLibro {
  libro: LibroTarjeta;
  /** `sizes` real de la caja donde se renderiza. Obligatorio para no servir de más. */
  sizes: string;
  /** Solo en la portada que es el LCP de la página. Nunca en más de una. */
  prioridad?: boolean;
  /**
   * `true` cuando el título y el autor ya están escritos justo al lado: evita
   * que el lector de pantalla lea dos veces lo mismo.
   */
  decorativa?: boolean;
  /** Grosor del lomo en píxeles. Súbelo en las portadas grandes. */
  grosor?: number;
  /** Giro de reposo en grados sobre el eje vertical. 0 = de frente. */
  giro?: number;
  /** Clases para el bloque del libro (por ejemplo, giro al pasar el cursor). */
  claseLibro?: string;
  /** Clases para la capa que flota. Se separa para no pisar el giro. */
  claseEnvoltorio?: string;
  className?: string;
}

/**
 * El libro, en volumen.
 *
 * Cuatro caras con transformaciones 3D de CSS —portada, lomo, canto y
 * contracubierta— en vez de una imagen plana. No entra ni WebGL ni una librería:
 * son cuatro planos rotados, y el navegador los compone en la GPU.
 *
 * No es adorno. Alcedo vende un PDF de 29 € frente a un Kindle de 5,99 €, y la
 * objeción silenciosa del comprador es «esto no es un libro de verdad». Un objeto
 * con lomo, canto y grosor contesta a esa objeción antes de que se formule.
 *
 * Si el frontmatter trae `portada`, la cubierta se sirve por `next/image` en
 * AVIF. Si todavía no la hay, se compone una portada tipográfica con los datos
 * reales del libro: cero bytes de imagen, cero CLS, y nadie la confunde con la
 * definitiva.
 */
export function PortadaLibro({
  libro,
  sizes,
  prioridad = false,
  decorativa = false,
  grosor = 26,
  giro = 0,
  claseLibro,
  claseEnvoltorio,
  className,
}: PropsPortadaLibro) {
  const sello = obtenerSello(libro.sello);
  const descripcion =
    libro.portada?.alt ?? `Portada de ${libro.titulo}, de ${libro.autorNombre}`;

  return (
    <div className={cn("escena-libro relative", className)}>
      <div className={cn("envoltorio-libro", claseEnvoltorio)}>
        <div
          className={cn("libro-3d", claseLibro)}
          style={
            {
              "--grosor": `${grosor}px`,
              "--color-libro": sello.hex,
              "--giro": `${giro}deg`,
            } as React.CSSProperties
          }
          role={decorativa ? "presentation" : "img"}
          aria-label={decorativa ? undefined : descripcion}
          aria-hidden={decorativa ? true : undefined}
        >
          <span className="cara-libro cara-contra" aria-hidden="true" />
          <span className="cara-libro cara-canto" aria-hidden="true" />

          <span className="cara-libro cara-lomo" aria-hidden="true">
            <span>
              {libro.titulo} · {libro.autorNombre}
            </span>
          </span>

          <div className="cara-libro cara-portada @container">
            {libro.portada ? (
              <Image
                src={libro.portada.src}
                /*
                 * El `alt` va aquí, en la imagen, y no solo en el `aria-label`
                 * del bloque: Google Images lee el `alt` y una portada de libro
                 * es una de las pocas imágenes que traen tráfico por sí solas.
                 * Vacío únicamente cuando el título ya está escrito al lado.
                 */
                alt={decorativa ? "" : descripcion}
                fill
                sizes={sizes}
                priority={prioridad}
                className="object-cover"
              />
            ) : (
              <PortadaTipografica
                libro={libro}
                colorSello={sello.hex}
                nombreSello={sello.nombre}
              />
            )}

            {/* Barrido de luz sobre el papel. Decorativo. */}
            <span className="brillo-portada" aria-hidden="true" />
          </div>
        </div>
      </div>

      <span className="sombra-libro" aria-hidden="true" />
    </div>
  );
}

/**
 * Cubierta provisional compuesta con tipografía.
 *
 * El texto escala con el contenedor (`cqw`), así que la misma cubierta funciona a
 * 120 px en una tarjeta y a 420 px en el hero sin ajustar nada.
 */
function PortadaTipografica({
  libro,
  colorSello,
  nombreSello,
}: {
  libro: LibroTarjeta;
  colorSello: string;
  nombreSello: string;
}) {
  return (
    <div className="flex h-full flex-col justify-between bg-white pt-[15%] pr-[9%] pb-[9%] pl-[11%]">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[6.5%]"
        style={{ backgroundColor: colorSello }}
      />

      <div>
        <p
          className="text-[2.6cqw] font-semibold tracking-[0.16em] uppercase"
          style={{ color: colorSello }}
        >
          {nombreSello}
        </p>
        <p className="mt-[7%] font-titulares text-[10cqw] leading-[1.05] font-semibold tracking-tight text-tinta">
          {libro.titulo}
        </p>
        <p className="mt-[5%] text-[3.6cqw] leading-snug text-tinta/65">
          {libro.subtitulo}
        </p>
      </div>

      <div>
        <span aria-hidden="true" className="block h-px w-[18%] bg-tinta/30" />

        <div className="mt-[4%] flex items-end justify-between gap-[6%]">
          <p className="text-[3.1cqw] font-semibold tracking-[0.1em] text-tinta/85 uppercase">
            {libro.autorNombre}
          </p>

          {/* Marca de editorial al pie, como en un libro impreso. Va con el color
              del sello y por máscara, así que no carga una imagen por portada. */}
          <span
            aria-hidden="true"
            className="block size-[9cqw] shrink-0"
            style={{
              backgroundColor: colorSello,
              maskImage: "url(/alcedo_simbolo_negro.svg)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: "url(/alcedo_simbolo_negro.svg)",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />
        </div>
      </div>
    </div>
  );
}
