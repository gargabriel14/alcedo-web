# PLAN — alcedo.com

Documento de trabajo. Al empezar cada fase se escribe aquí qué se va a hacer y por qué;
al terminarla, qué cambió y qué falta.

---

## FASE 1 — Cimientos · _en curso_

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

---

## FASE 2 — Contenido _(pendiente)_

## FASE 3 — Captura y tienda _(pendiente)_

## FASE 4 — Pulido y escala _(pendiente)_
