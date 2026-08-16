import Link from "next/link";
import { cn } from "@/lib/utils";

interface PropsLogo {
  /** Envuelve el logo en un enlace a la home. */
  comoEnlace?: boolean;
  /** En pantallas pequeñas deja solo el símbolo, sin el nombre. */
  soloSimboloEnMovil?: boolean;
  className?: string;
}

/**
 * El logotipo de la editorial, en su versión horizontal oficial.
 *
 * Se pinta como **máscara CSS** y no como imagen. Es la decisión que resuelve
 * tres cosas de una vez:
 *
 * - **Un solo fichero para los dos temas.** El kit trae versión negra y blanca;
 *   con máscara, el logo toma el color del texto y sirve igual sobre hueso, sobre
 *   tinta y sobre el verde de marca. La mitad de peticiones y ninguna versión que
 *   se quede sin actualizar.
 * - **El ojo del martín pescador sigue calado.** El SVG lo recorta con una
 *   máscara interna, y esa transparencia se conserva al usarlo como máscara.
 * - **Cero desplazamiento de maquetado.** La caja tiene proporción fija (3:1), así
 *   que ocupa su sitio antes de que el fichero llegue.
 *
 * El nombre de la editorial va además como texto real para lectores de pantalla:
 * una máscara CSS es decoración pura y no la lee nadie.
 */
export function Logo({
  comoEnlace = false,
  soloSimboloEnMovil = false,
  className,
}: PropsLogo) {
  const contenido = (
    <>
      {/* Versión horizontal: símbolo + nombre. */}
      <span
        aria-hidden="true"
        className={cn(
          "block h-9 w-[6.75rem] bg-current sm:h-10 sm:w-[7.5rem]",
          soloSimboloEnMovil && "hidden sm:block",
        )}
        style={mascara("/alcedo_horizontal_negro.svg")}
      />

      {/* En móvil, cuando se pide, solo el símbolo. */}
      {soloSimboloEnMovil ? (
        <span
          aria-hidden="true"
          className="block size-9 bg-current sm:hidden"
          style={mascara("/alcedo_simbolo_negro.svg")}
        />
      ) : null}

      <span className="sr-only">Editorial Alcedo</span>
    </>
  );

  if (comoEnlace) {
    return (
      <Link
        href="/"
        className={cn("inline-flex items-center rounded-sm text-texto", className)}
      >
        {contenido}
      </Link>
    );
  }

  return (
    <span className={cn("inline-flex items-center", className)}>{contenido}</span>
  );
}

/** Máscara CSS con los prefijos que aún necesita Safari. */
function mascara(ruta: string): React.CSSProperties {
  const valor = `url(${ruta})`;

  return {
    maskImage: valor,
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskImage: valor,
    WebkitMaskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
  };
}
