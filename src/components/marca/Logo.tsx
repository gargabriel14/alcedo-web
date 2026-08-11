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
 * Isotipo + nombre.
 *
 * El isotipo se pinta como **máscara CSS** de `public/logo.svg`, no como imagen.
 * Así el martín pescador toma el color del texto: tinta sobre hueso en claro,
 * hueso sobre tinta en oscuro, y en el pie sobre fondo oscuro sin tener que
 * mantener tres versiones del fichero. Cambiar el logo sigue siendo sustituir un
 * SVG y nada más.
 */
export function Logo({
  comoEnlace = false,
  soloIsotipoEnMovil = false,
  className,
}: PropsLogo) {
  const contenido = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className="size-9 shrink-0 bg-current sm:size-10"
        style={{
          maskImage: "url(/logo.svg)",
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskImage: "url(/logo.svg)",
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
        }}
      />
      <span
        className={cn(
          "flex flex-col leading-none",
          soloIsotipoEnMovil && "hidden sm:flex",
        )}
      >
        <span className="text-[0.5625rem] font-semibold tracking-[0.34em] text-texto-tenue uppercase">
          Editorial
        </span>
        <span className="mt-1 font-titulares text-[1.375rem] font-semibold tracking-tight">
          Alcedo
        </span>
      </span>
    </span>
  );

  if (comoEnlace) {
    // Sin `aria-label`: el nombre accesible sale del texto visible, que es lo que
    // permite decir «pulsa Editorial Alcedo» a quien navega por voz.
    return (
      <Link href="/" className="rounded-sm text-texto">
        {contenido}
      </Link>
    );
  }

  return contenido;
}
