import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PropsLogo {
  /** Envuelve el logo en un enlace a la home. */
  comoEnlace?: boolean;
  /** Oculta el nombre en pantallas pequeñas y deja solo el isotipo. */
  soloIsotipoEnMovil?: boolean;
  className?: string;
}

/**
 * Isotipo + nombre. El isotipo vive en `public/logo.svg`: el día que llegue el
 * logo definitivo se sustituye ese fichero y aquí no se toca nada.
 *
 * `unoptimized` porque un SVG de 500 bytes no necesita pasar por el optimizador
 * de imágenes (que además rechaza SVG por seguridad).
 */
export function Logo({ comoEnlace = false, soloIsotipoEnMovil = false, className }: PropsLogo) {
  const contenido = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src="/logo.svg"
        alt=""
        width={34}
        height={34}
        unoptimized
        priority
        className="size-[30px] shrink-0 sm:size-[34px]"
      />
      <span
        className={cn(
          "flex flex-col leading-none",
          soloIsotipoEnMovil && "hidden sm:flex",
        )}
      >
        <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.22em] text-texto-tenue">
          Editorial
        </span>
        <span className="font-titulares text-xl font-semibold tracking-tight text-texto sm:text-[1.375rem]">
          Alcedo
        </span>
      </span>
    </span>
  );

  if (comoEnlace) {
    return (
      <Link
        href="/"
        aria-label="Editorial Alcedo, ir a la portada"
        className="rounded-sm"
      >
        {contenido}
      </Link>
    );
  }

  return contenido;
}
