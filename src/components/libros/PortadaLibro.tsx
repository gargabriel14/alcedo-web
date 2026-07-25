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
  className?: string;
}

/**
 * Portada del libro.
 *
 * Si el frontmatter trae `portada`, se sirve por `next/image` en AVIF. Si todavía
 * no hay imagen, se dibuja una portada tipográfica con los datos reales del
 * libro: cero bytes de imagen, cero CLS, y nadie se confunde pensando que es la
 * portada definitiva. El texto escala con el contenedor (`cqw`), así que la misma
 * portada funciona a 120 px en una tarjeta y a 420 px en el hero.
 */
export function PortadaLibro({
  libro,
  sizes,
  prioridad = false,
  decorativa = false,
  className,
}: PropsPortadaLibro) {
  const sello = obtenerSello(libro.sello);
  const descripcion =
    libro.portada?.alt ?? `Portada de ${libro.titulo}, de ${libro.autorNombre}`;

  const marco = cn(
    "relative aspect-[2/3] w-full overflow-hidden rounded-sm rounded-r-md bg-white shadow-tarjeta ring-1 ring-black/10",
    className,
  );

  if (libro.portada) {
    return (
      <div className={marco}>
        <Image
          src={libro.portada.src}
          alt={decorativa ? "" : descripcion}
          fill
          sizes={sizes}
          priority={prioridad}
          className="object-cover"
        />
        <SombraLomo />
      </div>
    );
  }

  return (
    <div
      className={cn(marco, "@container")}
      role={decorativa ? "presentation" : "img"}
      aria-label={decorativa ? undefined : descripcion}
      aria-hidden={decorativa ? true : undefined}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[6.5%]"
        style={{ backgroundColor: sello.hex }}
      />

      <div className="flex h-full flex-col justify-between pt-[15%] pr-[9%] pb-[9%] pl-[11%]">
        <div>
          <p
            className="text-[2.6cqw] font-semibold tracking-[0.16em] uppercase"
            style={{ color: sello.hex }}
          >
            {sello.nombre}
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
          <p className="mt-[4%] text-[3.1cqw] font-semibold tracking-[0.1em] text-tinta/85 uppercase">
            {libro.autorNombre}
          </p>
        </div>
      </div>

      <SombraLomo />
    </div>
  );
}

/** Filete oscuro en el canto izquierdo: hace que el rectángulo lea como libro. */
function SombraLomo() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 w-[5%] bg-gradient-to-r from-black/18 via-black/6 to-transparent"
    />
  );
}
