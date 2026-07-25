# PLAN — alcedo.com

Documento de trabajo. Al empezar cada fase se escribe aquí qué se va a hacer y por qué;
al terminarla, qué cambió y qué falta.

---

## FASE 1 — Cimientos · _completada, a falta del despliegue_

### Objetivo

Que exista un sitio publicado, rápido y con carácter editorial, aunque todavía no venda:
el sistema de diseño, el layout y una home que ya comunica la propuesta de valor y captura
emails. Todo lo demás se construye encima de esto.

### Qué voy a hacer y por qué

| Decisión | Por qué |
| --- | --- |
| Next.js 16 (App Router) + React 19 + TypeScript estricto | Requisito del proyecto. SSG por defecto = HTML servido desde CDN, que es lo que hace que el LCP baje de 2 s sin trucos. |
| Tailwind 4 con tokens semánticos en CSS (`--fondo`, `--texto`, `--marca`…) | Los componentes no llevan `dark:` repartido por todas partes: el token cambia de valor y el componente no se entera. Menos clases, menos errores de contraste, un solo sitio donde ajustar la paleta. |
| Modo oscuro por clase `.oscuro` + script en línea en `<head>` | Respeta `prefers-color-scheme`, permite conmutador manual y **no fuerza render dinámico**. Leer una cookie en el layout raíz habría matado el SSG de todo el sitio. |
| Fraunces (titulares) + Inter (texto), vía `next/font` | `next/font` descarga la fuente **en build** y la sirve desde nuestro dominio: cero peticiones a Google en runtime, cero CLS por `size-adjust` automático. Sin ejes extra (`SOFT`/`WONK`) para no engordar el fichero. |
| Contenido de la home en `src/lib/datos/*.ts` | En Fase 1 no hay pipeline de MDX todavía. Estos ficheros son el puente: en Fase 2 el mismo tipo de dato vendrá de `/content` y los componentes no cambian. |
| Rutas de la navegación creadas como página «en preparación» (`noindex`) | Un menú que devuelve 404 penaliza en SEO y desconcierta al que revisa la web. Se sustituyen por las reales en Fase 2. |
| Radix UI solo para el diálogo del menú móvil | Es la única primitiva donde hacerlo a mano sale mal: foco atrapado, `Esc`, `aria-*` y scroll del body. ~10 kB por accesibilidad AA de verdad. |

### Contenido de ejemplo (a sustituir por el fundador)

Marcado en el código con `TODO(contenido)`. Los datos fiscales van con marcadores
`[[RAZÓN SOCIAL]]`, `[[NIF]]`, `[[DIRECCIÓN]]`.

- Libro destacado: _Excel para autónomos en España_ (Alcedo Práctico), PDF Premium 29 €.
- Lead magnet de portada: _Plantilla de IVA trimestral para autónomos_.
- Dos libros más en «últimas publicaciones» (Práctico y Vida).
- Testimonios: maquetados con marcador visible `[[RESEÑA PENDIENTE]]`.
  **No se publica `aggregateRating` hasta que existan reseñas reales.**

### Fuera de alcance en esta fase

Pipeline de MDX, ficha de libro, catálogo, Supabase, Resend, pasarela de pago, tests.
El formulario de captura valida en servidor pero **todavía no guarda ni envía nada**:
lo dice explícitamente en pantalla para no engañar a nadie.

### Qué cambió (cierre de fase)

- Proyecto **Next.js 16.2.11 + React 19 + Tailwind 4** con TypeScript en modo
  estricto ampliado (`noUncheckedIndexedAccess`, `noUnusedLocals`…).
- Sistema de diseño: paleta hueso/tinta/martín pescador, tres colores de sello,
  tokens semánticos con modo oscuro completo, Fraunces + Inter autoalojadas.
- Layout: cabecera pegajosa con navegación, menú móvil accesible (Radix Dialog),
  conmutador de tema sin destello, pie con sellos, editorial y legales.
- Componentes base: `Boton`/`EnlaceBoton`, `BadgeSello`, `Contenedor`,
  `TituloSeccion`, `Logo`, `PortadaLibro` (tipográfica mientras no haya imagen),
  `TarjetaLibro`, `CapturaEmail`.
- Home con los cinco bloques: hero (claim + libro destacado + captura), tres
  sellos, últimas publicaciones, testimonios y Compromiso Alcedo.
- SEO base: metadatos con plantilla de título, Open Graph, JSON-LD de
  `Organization` y `WebSite` con `SearchAction`, `sitemap.xml` y `robots.txt`.
- Páginas puente con `noindex` para las 11 rutas del mapa aún no construidas,
  más el 404 propio.
- 25 rutas generadas **como HTML estático**. `pnpm verificar` en verde.

### Verificado

- Modo oscuro y conmutador manual: la elección se guarda y, si coincide con la
  del sistema, se borra para volver a seguirlo.
- **Cero peticiones a hosts externos** en la home (fuentes autoalojadas).
- Contrastes de la paleta calculados a mano: texto 16,9:1 · texto tenue 7,2:1 ·
  enlaces de marca 5,8:1 sobre fondo hueso. Todos por encima de AA.

### Qué falta para cerrar la fase

1. **Despliegue en Vercel**: lo tiene que hacer el fundador (repo en GitHub +
   importar en Vercel). No manejo credenciales.
2. Auditoría Lighthouse real sobre la URL desplegada. En local no mide igual.
3. Sustituir el contenido de ejemplo y los datos fiscales.

---

## FASE 2 — Contenido · _en curso_

### Objetivo

Que el contenido editorial salga del repositorio y no del código, y que exista la
página que vende: la ficha de libro. Al terminar, el sitio tiene catálogo real,
fichas completas, landings de sello, autores y blog, todo indexable.

### Qué voy a hacer y por qué

| Decisión | Por qué |
| --- | --- |
| Contenido en `/content/{libros,autores,blog}` en MDX con frontmatter | El fundador edita un fichero de texto, no código. Va versionado en git, así que hay historial y se puede revertir. Cero coste de CMS. |
| Validación con **Zod** y **build que falla** si falta un campo | Un libro sin precio o sin `sku` publicado en producción es dinero perdido. Mejor romper el despliegue que vender mal. Los mensajes de error dicen el fichero y el campo. |
| Filtros del catálogo en cliente, sin parámetros en la URL | Todos los libros están en el HTML (indexables) y la página sigue siendo estática. La dimensión que sí interesa a Google —el sello— tiene su propia URL en `/sellos/[sello]`. |
| Índice del libro con `<details>` nativo | Desplegable accesible y con teclado sin un byte de JavaScript. Radix aquí sería lujo. |
| Barra de compra pegajosa en móvil con `IntersectionObserver` | Aparece al pasar el selector de formato. Es el patrón que más sube la conversión en móvil y cuesta ~1 kB. |
| Imágenes OG generadas con `next/og` y la fuente por defecto | Satori necesita datos de fuente explícitos; meter Fraunces obligaría a versionar un TTF o a descargarlo en build. Se compensa con color de sello y jerarquía. Pendiente de mejora si añadimos el TTF a `/public`. |
| Sin `aggregateRating` en el JSON-LD | No hay reseñas reales. Se activa el día que las haya, no antes. |

### Fuera de alcance en esta fase

`/content/productos` y `/content/recursos` (son tienda: Fase 3), Supabase, Resend,
pasarela, área de cliente y las páginas legales definitivas.

## FASE 2 bis — nota de la Fase 1

Se añadió, a petición del fundador, `src/lib/garantia.ts`: los plazos de garantía
(14 días) y de actualizaciones (12 meses) se calculan en un solo módulo que decide
si siguen vigentes para una compra concreta. El texto de venta lee esos plazos del
mismo sitio, así que no puede prometer algo que el sistema no cumpla.

## FASE 3 — Captura y tienda _(pendiente)_

## FASE 4 — Pulido y escala _(pendiente)_
