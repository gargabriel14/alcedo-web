# PLAN — alcedo.com

## FASE 6 — Escalado · _epic 01 hecho, 02 a 05 diseñados_

### El encargo y la objeción

El fundador pide escalar en cuatro frentes a la vez —vender de verdad, aguantar
volumen de contenido, proceso de equipo e internacionalización— con una previsión
de **más de 24 libros al año y autores externos**.

La objeción, dicha antes de empezar: hoy hay **cero libros publicados**. Construir
ahora la paginación, el buscador y el flujo de autores externos es levantar
andamios para un edificio que no se ha empezado, y es como se hunden los proyectos
que nunca llegan a la primera venta.

La línea que separa lo que sí y lo que no:

| Se hace ahora | Se deja diseñado, sin construir |
| --- | --- |
| CI y convenciones escritas | Paginación y buscador del catálogo |
| Cerrar la venta real | Rutas `/en` |
| Que el acceso a contenido no asuma «todo en memoria» | Portadas con blur y srcset completo |
| Imágenes OG bajo demanda en vez de en build | Flujo de revisión para autores externos |

La columna izquierda cuesta poco y evita reescrituras. La derecha se construye
cuando el número lo pida.

### Los cinco epics, en orden de dependencia

**01 · Guardarraíl — HECHO.** CI en GitHub Actions (`.github/workflows/verificar.yml`)
que corre tipos, lint, tests y build en cada push y cada pull request, más los
flujos de navegador contra el proveedor simulado. `CLAUDE.md` y `AGENTS.md` con las
siete reglas que antes solo vivían en comentarios. `.claude/settings.json` con los
comandos permitidos y con `.env.local` denegado a la lectura.

**02 · Venta real.** Validar el adaptador de Paddle contra eventos de sandbox —hoy
está escrito según su documentación y **nunca ha visto un evento real**—, dominio
verificado en Resend, SMTP de Resend dentro de Supabase para los enlaces mágicos, y
observabilidad del webhook: uno que falla en silencio es un cliente que pagó y no
recibió nada.

**03 · Catálogo que aguanta.** Lo barato de hacer ahora: que `src/lib/contenido/`
deje de asumir que todo cabe en memoria, imágenes OG bajo demanda con caché (en
build, 100 libros son 100 renders por despliegue) y un presupuesto de tiempo de
build vigilado por CI. Paginación y buscador quedan diseñados, no construidos.

**04 · Autores externos.** El punto donde el modelo actual se rompe: contenido en
git editado por una persona. **Recomendación: no meter un CMS.** Los autores entran
por `/publica-con-alcedo`, y el fundador scaffoldea el MDX aceptado con
`pnpm nuevo-libro`. El repositorio sigue con un solo escritor, que es lo que
mantiene el coste en cero y el contenido versionado.

**05 · i18n.** Segmento `[idioma]`, `content/en`, hreflang y canónicas por idioma.
El último, porque un libro en inglés es un libro distinto y no el mismo con otras
etiquetas.

### Decisiones de alcance

- Se **mantienen** el diseño aprobado y la capa de pago desacoplada.
- Se dan por **libres** las URLs y el esquema de Supabase: no hay tráfico ni un solo
  registro, así que cambiarlos hoy sale gratis y mañana no.
- Ninguna URL cambia en los epics 01 a 03.
- Rollback: cada epic es un commit revertible y el 02 va detrás de
  `PROVEEDOR_PAGO`, así que volver al simulado es cambiar una variable.

### Pendiente

Los epics 02 a 05 necesitan el bundle completo de `/architect-brownfield`
(20 secciones, `tasks.json`, epics y workspace, con el validador en verde). Se
genera en una sesión limpia, con este apartado como entrada.

## FASE 5 — Rediseño con la identidad definitiva · _en curso_

### De dónde sale

El fundador aporta el **logo definitivo** (martín pescador en verde azulado sobre
hueso) y una **referencia de dirección de arte**: una maqueta de editorial premium
con libro 3D en CSS, antetítulos con filete, titulares serif con cursiva de acento,
secciones oscuras, ticker, manifiesto y formularios de línea baja.

### Qué se toma y qué no

| Se toma | Por qué |
| --- | --- |
| Libro 3D en CSS (portada, lomo, canto, contracubierta) | Da volumen de objeto sin WebGL ni una sola librería. Vende el libro como cosa física, que es lo que diferencia a Alcedo de una tienda de infoproductos. |
| Antetítulo con filete, titular grande con cursiva de acento | Es la jerarquía que hace que un sitio parezca editorial y no plantilla. |
| Sección oscura, manifiesto y ticker | Cortan el ritmo de la página y dan sitio a la voz de la marca. |
| Formularios de línea baja | Menos caja, más papel. Y menos peso visual en el móvil. |
| Reveals al hacer scroll | Con `IntersectionObserver`, una vez por elemento y anulados con `prefers-reduced-motion`. |

| **No** se toma | Por qué |
| --- | --- |
| Su paleta terracota y latón | Alcedo ya tiene tres sellos con color propio. Meter un cuarto acento rompería el sistema. |
| Su tipografía de texto (Archivo) sustituyendo a Inter | Se adopta: Archivo tiene más carácter editorial que Inter y sigue siendo self-hosted por `next/font`. |
| Efecto imán en los botones | Sigue al cursor con `pointermove`. En un sitio donde el 75 % del tráfico es táctil, es JavaScript que no ve casi nadie. |
| Todo en un solo fichero | La referencia es una demo. Aquí el contenido vive en `/content` y el sistema en componentes. |

### Decisión de marca

El logo es de un **verde azulado oscuro**, distinto del `#0E7C9B` que fijaba el
brief como color de marca. Se hace primario el color del logo y `#0E7C9B` se queda
como color del sello Práctico, que es donde el brief lo necesita. Una marca cuyo
logo y cuya web no comparten color arranca ya descosida.

### Pendiente del fundador

`public/logo.svg` es una **reconstrucción**: hay que sustituirlo por el fichero
original. El componente lo consume por máscara CSS, así que el color se adapta solo
al tema claro y oscuro y no hay que tocar código.

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

## FASE 2 — Contenido · _completada_

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

### Qué cambió (cierre de fase)

- **Pipeline de contenido**: `/content/{libros,autores,blog}` en MDX, leído en build,
  validado con Zod. El build se para con el fichero y el campo exactos si algo falta,
  y también si un libro apunta a un autor que no existe.
- **Ficha de libro** con los diez bloques: portada y datos, selector de tres formatos
  comparados con el PDF Premium destacado y su razón explícita, resultados en verbo,
  descripción larga en MDX, índice desplegable con `<details>` nativo, muestra
  gratuita (con visor, o el hueco explicado si aún no hay imágenes), entregables uno a
  uno con su icono, reseñas, FAQ, barra de compra pegajosa en móvil y venta cruzada.
- **Catálogo** con filtro por sello, tema y formato resuelto en el navegador sobre
  HTML estático: todos los libros siguen siendo indexables.
- **Landings de sello** con su color, sus libros y sus artículos.
- **Blog** con índice lateral generado de los titulares, tiempo de lectura,
  `<Captura />` insertable a mitad del texto y cierre siempre hacia el libro.
- **Autores**: listado y ficha con biografía larga en MDX.
- **SEO**: `generateMetadata` en todas las rutas dinámicas, imágenes OG generadas en
  build con `next/og`, JSON-LD de `Book`, `Product` con oferta, `FAQPage`, `Article`,
  `Person` y `BreadcrumbList`, y sitemap construido del contenido real.
- **Herramientas para el fundador**: `CONTENIDO.md` con la guía de estilo de cada tipo
  de ficha y `pnpm nuevo-libro "Título"` para crear un libro con todos los campos.
- **`/comprar/[sku]`**: la URL definitiva de compra ya existe y explica que la pasarela
  llega en la Fase 3, así que ningún botón del sitio tendrá que cambiar.

### Verificado

- 40 rutas generadas como HTML estático, imágenes OG incluidas.
- `pnpm verificar` (tipos + lint + build) en verde.
- Ficha de libro y artículo comprobados en el navegador: el MDX renderiza, el índice
  enlaza a anclas que existen y la captura de correo cae donde debe.

### Qué falta

1. Portadas reales y páginas de muestra: hoy se dibujan portadas tipográficas.
2. Enlaces de Amazon: los botones están apagados hasta que existan las URL.
3. Reseñas reales. Sin ellas no hay `aggregateRating`, y así seguirá.
4. `/sobre-alcedo`, `/contacto` y `/recursos` siguen siendo páginas puente.

## FASE 2 bis — nota de la Fase 1

Se añadió, a petición del fundador, `src/lib/garantia.ts`: los plazos de garantía
(14 días) y de actualizaciones (12 meses) se calculan en un solo módulo que decide
si siguen vigentes para una compra concreta. El texto de venta lee esos plazos del
mismo sitio, así que no puede prometer algo que el sistema no cumpla.

## FASE 3 — Captura y tienda · _completada, a falta de credenciales_

### Objetivo

Que el sitio cobre y entregue. Al terminar, un desconocido puede comprar el PDF
Premium, descargarlo al instante, recibirlo por correo y volver a descargarlo desde
su cuenta doce meses después. Y quien no compra, deja su correo a cambio de una
plantilla útil.

### Qué voy a hacer y por qué

| Decisión | Por qué |
| --- | --- |
| Capa de pago propia en `src/lib/pagos/` | Nadie fuera de esa carpeta importa el SDK de Paddle. Cambiar a Lemon Squeezy o Gumroad debe ser escribir un fichero nuevo, no rehacer la tienda. |
| **Proveedor simulado por defecto** | La cuenta de Paddle se solicita cuando la web ya está publicada, porque revisan el negocio. Con el simulado se construye y se prueba la compra entera, de principio a fin, sin credenciales. |
| Precio validado en servidor contra `/content/productos` | El cliente nunca manda el precio. Y si el precio del producto no cuadra con el de la ficha del libro, **el build falla**: dos precios distintos para lo mismo es una reclamación asegurada. |
| Idempotencia por id de evento en tabla propia | Las pasarelas reintentan los webhooks. Sin esto, un reintento genera un pedido duplicado y un segundo correo al cliente. |
| Descarga inmediata en `/checkout/exito`, sin esperar al correo | El momento de máxima confianza es justo tras pagar. Si ahí le pides que revise su bandeja de entrada, pierdes al que tiene el correo en otro dispositivo. |
| Token de descarga firmado + límite de 5 + caducidad | Los enlaces se comparten. El límite protege el producto sin castigar al comprador honrado, que además siempre puede re-descargar desde su cuenta. |
| Ficheros versionados en el catálogo | Es lo que hace **real** la promesa de «actualización gratuita 12 meses»: la descarga sirve siempre la última versión, y un script avisa por correo a quien esté en plazo. |
| Modo local sin credenciales | Si faltan las variables de Supabase o Resend, la aplicación no revienta: guarda en memoria y escribe los correos por consola. Así se puede desarrollar y probar sin tocar producción. |

### Fuera de alcance en esta fase

Tests automáticos (Fase 4), `/publica-con-alcedo` y la auditoría Lighthouse final.

### Qué cambió (cierre de fase)

- **Capa de pago desacoplada** en `src/lib/pagos/`: contrato propio (`crearCheckout`,
  `verificarWebhook`, `normalizarPedido`), proveedor **simulado** y adaptador de
  **Paddle** hecho contra su API REST, sin SDK. Nadie fuera de esa carpeta sabe con
  quién se cobra.
- **Catálogo de productos** en `/content/productos` con SKU, precio, ficheros
  versionados y bundles. El build falla si el precio del producto no coincide con el
  que anuncia la ficha del libro.
- **Webhook idempotente** con verificación de firma; si el procesado falla se libera
  el id para que el reintento de la pasarela pueda con él.
- **Descargas**: token aleatorio revocable, caducidad de 30 días, límite de 5 y URL
  firmada de 24 h desde un bucket privado. El fichero no pasa por nuestro servidor.
- **`/checkout/exito`** con descarga inmediata, sin esperar al correo.
- **Doble opt-in** completo: alta, correo de confirmación, entrega en la propia
  página de confirmación y landing indexable por cada lead magnet.
- **Área de cliente** con enlace mágico: compras, re-descarga, versión de cada
  fichero y días de garantía restantes, calculados con `garantia.ts`.
- **Legales** en `/content/legal` como plantillas con marcadores, incluida la
  política de reembolso que Paddle exige, y **aviso de cookies** honesto.
- **Analítica propia** sin cookies: endpoint con lista cerrada de eventos y registro
  de `click_amazon` con `sendBeacon`.
- **`pnpm avisar-actualizacion <sku>`**: avisa por correo a quien está en plazo de
  actualizaciones cuando sube una versión. Simula por defecto; envía con `--de-verdad`.
- **Modo local**: sin credenciales, la tienda entera funciona guardando en memoria y
  escribiendo los correos por consola.

### Verificado (con el proveedor simulado)

| Prueba | Resultado |
| --- | --- |
| Webhook con firma correcta | 200, pedido creado |
| Mismo webhook repetido | 200 `duplicado: true`, sin segundo pedido |
| Webhook sin firma | 400, no se procesa |
| Página de éxito | Token, correo enmascarado, 5 ficheros y días de garantía |
| Descargas 1 a 5 | 200 |
| Descarga 6 | 429 con instrucciones para regenerar el enlace |

### Qué falta

1. Pegar el esquema SQL en Supabase y subir los ficheros al bucket `productos`.
2. Rellenar `.env.local` y las variables en Vercel.
3. Revisión profesional de los cuatro documentos legales.
4. Solicitar la cuenta de Paddle **con la web ya publicada** y pegar los id de precio.
5. El adaptador de Paddle está escrito según su documentación pero **sin validar
   contra eventos reales**: hay que probarlo en sandbox antes de vender.

## FASE 4 — Pulido y escala · _en curso_

### Objetivo

Que lo construido no se rompa sin avisar, que cargue rápido en un móvil con mala
cobertura y que se pueda enseñar a un autor externo.

### Qué voy a hacer y por qué

| Decisión | Por qué |
| --- | --- |
| Vitest sobre la lógica que toca dinero | Precios, tokens, límite de descargas y plazos de garantía. Un fallo ahí no da error: cobra de menos, regala descargas o incumple una promesa por escrito. Es justo lo que no se detecta mirando la pantalla. |
| Playwright solo en dos flujos | Captura de correo y compra completa. Son los dos caminos que generan dinero; el resto se cubre con tipos y con los tests de lógica. Veinte tests de navegador que tardan cinco minutos no los ejecuta nadie. |
| Playwright contra el **proveedor simulado** | La compra se prueba de verdad, de la ficha a la descarga, sin credenciales y sin mover un euro. Es la razón por la que el proveedor simulado existe. |
| Lighthouse sobre el build de producción | En modo desarrollo las cifras no valen: no hay minificado y sí hay sobrecarga de recarga en caliente. |
| i18n preparado, no implementado | Montar `/en` sin contenido en inglés añade rutas vacías y complejidad. Se deja documentado el camino y sin nada que lo bloquee. |

### Qué cambió (cierre de fase)

- **41 tests de Vitest** sobre lo que toca dinero: plazos de garantía y
  actualizaciones, formato y coherencia de precios, herencia de ficheros en los
  bundles, validación del frontmatter, índice y tiempo de lectura, y el proveedor
  de pago. Incluye el test que más importa: **el importe sale del catálogo del
  servidor aunque el evento del webhook venga manipulado**.
- **9 tests de Playwright** en móvil sobre los dos flujos que dan dinero: captura de
  correo (incluido el rechazo de un correo inválido y el enlace caducado) y compra
  completa de la ficha a la descarga, con el límite de 5 descargas comprobado.
- **`/publica-con-alcedo`**: landing de captación para Alcedo Autores con formulario
  de propuesta de cuatro campos, sin prometer ningún porcentaje que todavía no
  existe por contrato.
- **Optimizaciones reales de carga**: subconjunto `latin` en las dos fuentes y un
  solo grosor de Fraunces (fuentes de 201 kB a 66 kB), analítica de Vercel solo en
  Vercel, y aviso de cookies cargado aparte. **Peso total de la portada: 457 kB → 321 kB.**
- **Accesibilidad**: corregido el nombre accesible del logo, que no coincidía con su
  texto visible y rompía la navegación por voz.

### Auditoría definitiva — PageSpeed Insights sobre producción

Medido por Google sobre `https://alcedo-web.vercel.app/`, que es la única medición
que vale: sin la CPU del portátil compitiendo con el servidor.

| Categoría | Móvil | Ordenador |
| --- | --- | --- |
| Rendimiento | **96** | **100** |
| Accesibilidad | **100** | 100 |
| Prácticas recomendadas | **100** | 100 |
| SEO | **100** | 100 |

Métricas en móvil: **FCP 0,9 s · LCP 2,7 s · TBT 0 ms · CLS 0 · Speed Index 2,8 s**.
En ordenador: FCP 0,3 s · LCP 0,4 s · TBT 10 ms · CLS 0.

**Objetivo del brief cumplido**: los cuatro apartados por encima de 95 en móvil.

Queda una cosa a medias: el brief pedía además **LCP < 2,0 s** y está en 2,7 s, dentro
de la banda «mejorable» de Google (2,5–4,0 s). El elemento que marca el LCP es hoy el
párrafo del hero, porque no hay portadas reales. Cuando entren, el LCP pasará a ser
una imagen AVIF con `priority` y precarga, que es justo el caso que Chrome mide mejor.
Volver a medir entonces, antes de tocar nada más.

Lo que PageSpeed sigue señalando, por orden de lo que aportaría: JavaScript heredado
para navegadores antiguos (~11 kB), peticiones que bloquean el renderizado (~150 ms) y
JavaScript sin usar (~40 kB). Nada de eso mueve la aguja mientras el LCP dependa del
contenido de ejemplo.

### Auditoría previa en local (por qué no servía)

| Categoría | Resultado |
| --- | --- |
| Accesibilidad | **100** |
| Buenas prácticas | **100** |
| SEO | **100** |
| Rendimiento | **77–80** en local (ver abajo) |

Escritorio: rendimiento 99, accesibilidad 100, buenas prácticas 96 → 100 tras los
arreglos.

**El rendimiento no llega a 95 midiendo en local, y conviene entender por qué antes
de tocar nada más.** Tres mediciones del mismo build:

| Condiciones | Rendimiento | LCP | TBT |
| --- | --- | --- | --- |
| Móvil completo (CPU ×4 + 4G lenta) | 77–80 | 3,6 s | 320–470 ms |
| Sin freno de CPU | 90 | 3,4 s | 10 ms |
| Sin freno de red ni CPU | 93 | 2,6 s | 0 ms |

El TBT se desploma de 400 ms a 10 ms al quitar el freno de CPU: casi todo el castigo
viene de emular un móvil lento **en la misma máquina que está sirviendo la web**.
Y la red simulada (1,6 Mbps) tiene que tragarse 321 kB sin CDN, sin HTTP/2 y sin
Brotli, tres cosas que sí hay en Vercel.

**La medición que cuenta es la de la URL desplegada**, y es la que falta:

```bash
npx lighthouse https://TU-DOMINIO --view --only-categories=performance,accessibility,best-practices,seo
```

Si ahí el rendimiento siguiera por debajo de 95, el siguiente recorte es el
JavaScript de cliente (187 kB): cargar el menú móvil de Radix solo al pulsarlo.

### Preparación para `/en`

No se implementa, pero nada lo bloquea:

- El idioma del documento sale de `SITIO.idioma`, no está escrito a mano.
- Todo el contenido editorial vive en `/content`, así que la versión inglesa sería
  `content/en/{libros,blog,autores}` sin tocar los componentes.
- El camino es un segmento `[idioma]` en `src/app` con `generateStaticParams`, y
  añadir `alternates.languages` en `generateMetadata`.
- Lo que **no** hay que hacer es traducir con una librería de cadenas: aquí el
  contenido es el producto, y un libro en inglés es un libro distinto, no el mismo
  con otras etiquetas.
