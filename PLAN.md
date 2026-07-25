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

## FASE 2 — Contenido _(pendiente)_

## FASE 3 — Captura y tienda _(pendiente)_

## FASE 4 — Pulido y escala _(pendiente)_
