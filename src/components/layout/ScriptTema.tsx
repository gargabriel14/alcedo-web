export const CLAVE_TEMA = "alcedo-tema";

/**
 * Decide el tema antes del primer paint para que no haya destello blanco.
 *
 * Va en línea en `<head>` a propósito:
 * - Leer una cookie en el layout raíz obligaría a render dinámico y el sitio
 *   entero dejaría de ser estático (adiós LCP y adiós caché de CDN).
 * - Hacerlo en un `useEffect` significaría pintar en claro y saltar a oscuro.
 *
 * El tema no es un dato crítico, así que `localStorage` es el sitio correcto:
 * si falla o está bloqueado, se cae con elegancia a `prefers-color-scheme`.
 */
const CODIGO = `(function(){try{
var g=localStorage.getItem('${CLAVE_TEMA}');
var s=window.matchMedia('(prefers-color-scheme: dark)').matches;
var o=g==='oscuro'||(g!=='claro'&&s);
document.documentElement.classList.toggle('oscuro',o);
}catch(e){}})();`;

export function ScriptTema() {
  return <script dangerouslySetInnerHTML={{ __html: CODIGO }} />;
}
