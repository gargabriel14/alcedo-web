# alcedo.com — plataforma de Editorial Alcedo

Web y tienda de **Editorial Alcedo**, editorial independiente española de no-ficción
práctica ilustrada. Claim: _Conocimiento con puntería_.

El sitio tiene un objetivo medible: **vender el PDF Premium y capturar correos**.
Amazon es el canal de captación; aquí está el margen.

> **Estado: fases 1, 2 y 3 completadas.** Sistema de diseño, catálogo en MDX, ficha
> de libro, blog, tienda con pasarela desacoplada, doble opt-in, descargas firmadas
> y área de cliente. Todo funciona **sin credenciales** contra un proveedor de pago
> simulado. Falta conectar las cuentas reales y la Fase 4 (tests y Lighthouse).
> El plan por fases está en [PLAN.md](PLAN.md).

---

## Poner la tienda en marcha (cuando tengas las cuentas)

1. **Supabase** → SQL Editor → pega `supabase/migraciones/0001_esquema.sql` → Run.
   Crea las tablas y el bucket privado `productos`.
2. Sube los ficheros que vendes al bucket `productos`, respetando las rutas que
   declara cada `content/productos/*.mdx`.
3. Copia las claves a `.env.local` (y a Vercel → Settings → Environment Variables).
   Los nombres y para qué sirve cada una están comentados en `.env.example`.
4. **Resend** → verifica tu dominio y pon `EMAIL_REMITENTE` con una dirección de ese
   dominio. Sin dominio verificado, los correos van a spam.
5. **Paddle** se solicita **con la web ya publicada**: revisan el negocio, las
   páginas legales y la política de reembolso antes de aprobar. Hasta entonces,
   `PROVEEDOR_PAGO=simulado` permite probarlo todo.

Mientras falte cualquiera de esas variables, el sitio entra en **modo local**:
guarda en memoria, escribe los correos en la consola y lo dice en pantalla. No
finge nunca que ha guardado o enviado algo.

### Avisar de una actualización

Cuando subas una versión nueva de un fichero, actualiza su `version` y su
`actualizado` en `content/productos/<sku>.mdx` y lanza:

```bash
pnpm avisar-actualizacion pdf-excel-autonomos
```

Muestra a quién escribiría (solo a quien sigue dentro de sus 12 meses). Cuando lo
veas bien, repite con `--de-verdad`.

---

## Puesta en marcha local

Necesitas **Node 20 o superior** y **pnpm**. Comprueba lo que tienes con `node -v`.
Si no tienes pnpm: `npm install -g pnpm`.

```bash
pnpm install
```

Copia las variables de entorno:

```bash
cp .env.example .env.local
```

Arranca el servidor de desarrollo:

```bash
pnpm dev
```

La web queda en <http://localhost:3000>. En la Fase 1 no hace falta rellenar
ninguna clave: el sitio funciona entero sin servicios externos.

### Comandos

| Comando | Para qué |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo con recarga en caliente. |
| `pnpm build` | Build de producción. Falla si hay un error de tipos. |
| `pnpm start` | Sirve el build de producción en local (para medir de verdad). |
| `pnpm typecheck` | Solo la comprobación de tipos. |
| `pnpm lint` | ESLint. |
| `pnpm verificar` | Tipos + lint + build. **Pásalo antes de cada despliegue.** |

---

## Estructura del repositorio

```
content/                   EL CONTENIDO EDITORIAL. Aquí se escribe, sin tocar código.
├─ libros/                 Una ficha por libro   → /libro/<fichero>
├─ autores/                Una ficha por autor   → /autor/<fichero>
└─ blog/                   Un artículo por fichero → /blog/<fichero>

scripts/
└─ nuevo-libro.mts         Crea la ficha de un libro nuevo con todos los campos

src/
├─ app/                    Rutas (App Router). Una carpeta = una URL.
│  ├─ layout.tsx           Cabecera, pie, fuentes, metadatos y JSON-LD del sitio
│  ├─ page.tsx             Home
│  ├─ libro/[slug]/        Ficha de libro + su imagen para redes
│  ├─ catalogo/            Catálogo con filtros
│  ├─ sellos/[sello]/      Landing de cada sello
│  ├─ blog/                Listado y artículos
│  ├─ autor/[slug]/        Ficha de autor
│  ├─ comprar/[sku]/       Inicio de compra (se conecta a la pasarela en la Fase 3)
│  ├─ robots.ts            robots.txt generado
│  └─ sitemap.ts           sitemap.xml generado a partir del contenido
├─ components/
│  ├─ catalogo/            Filtros del catálogo
│  ├─ formularios/         Captura de correo
│  ├─ home/                Bloques de la portada
│  ├─ layout/              Cabecera, pie, menú móvil, conmutador de tema
│  ├─ libros/              Portada, tarjeta, selector de formato, índice, FAQ…
│  ├─ marca/               Logo
│  ├─ mdx/                 Renderizado del contenido MDX
│  ├─ seo/                 Inserción de datos estructurados
│  └─ ui/                  Botón, badge de sello, contenedor, título de sección
└─ lib/
   ├─ contenido/           Lectura y validación del MDX con Zod
   ├─ boletin/             Acción de servidor del alta en la lista
   ├─ datos/               Lo que aún no es MDX: recursos y testimonios
   ├─ seo/                 JSON-LD, plantilla de imágenes OG y rutas indexables
   ├─ garantia.ts          Plazos de garantía y actualizaciones (fuente única)
   ├─ sellos.ts            Los tres sellos y sus colores
   ├─ sitio.ts             Configuración global (dominio, navegación, claim)
   └─ utils.ts             Formato de precios y fechas, unión de clases
```

En la **Fase 3** aparecerán `content/productos` y `content/recursos`, que son ya
cosa de la tienda.

---

## Cómo añadir un libro nuevo

Pensado para hacerlo sin saber programar. La guía completa de cada campo está en
[CONTENIDO.md](CONTENIDO.md).

**1. Crea la ficha con el script.** Te deja todos los campos preparados:

```bash
pnpm nuevo-libro "Excel para fotógrafos" --sello=practico
```

**2. Abre el fichero** que te indica (`content/libros/excel-para-fotografos.mdx`) y
sustituye todos los `TODO` por tus textos. El nombre del fichero es la URL, así que
piénsalo antes: cambiarlo después rompe los enlaces.

**3. Míralo en local:**

```bash
pnpm dev
```

**4. Sube los cambios a GitHub.** Vercel despliega solo y en un minuto está en línea.

Si te dejas un campo obligatorio, el despliegue **se para** y te dice el fichero y el
campo exactos. Es aposta: mejor eso que publicar un libro sin precio.

### Dónde se cambia lo demás

| Qué | Dónde |
| --- | --- |
| Libros, autores y artículos | `content/` (ver [CONTENIDO.md](CONTENIDO.md)) |
| Lead magnets (descargas gratis) | `src/lib/datos/recursos.ts` |
| Reseñas de lectores | `src/lib/datos/testimonios.ts` |
| Compromiso Alcedo | `src/components/home/CompromisoAlcedo.tsx` |
| Plazos de garantía y actualizaciones | `src/lib/garantia.ts` |
| Claim, propuesta y navegación | `src/lib/sitio.ts` |
| Textos de los sellos | `src/lib/sellos.ts` |

Busca `TODO(contenido)` en el proyecto para encontrar todo lo que está pendiente
de sustituir por datos definitivos.

### El logo

Sustituye `public/logo.svg` por el logo definitivo, en formato cuadrado, y no
toques nada más: el componente `<Logo />` lo consume tal cual. El favicon es
`src/app/icon.svg`.

---

## Despliegue en Vercel

1. Sube el repositorio a GitHub (privado vale).
2. En <https://vercel.com/new>, importa el repositorio. Vercel detecta Next.js:
   **no hay que cambiar ninguna opción de build**.
3. Variables de entorno: en la Fase 1 ninguna es obligatoria. Cuando tengas
   dominio, añade `NEXT_PUBLIC_URL_SITIO` con la URL final y sin barra al final.
   Mientras no lo haya, el sitio usa automáticamente la URL del proyecto de
   Vercel para canónicas, Open Graph y sitemap.
4. En el panel del proyecto → **Analytics**, activa Web Analytics (gratis). Hasta
   que lo hagas verás en la consola del navegador un aviso de que el script no
   carga: es normal en local y no rompe nada.
5. Cada `push` a la rama principal despliega a producción; cada rama genera su
   propia URL de previsualización.

Coste: **0 €/mes** en Vercel Hobby con este tamaño de proyecto.

---

## Decisiones que conviene conocer

### El IVA no se calcula aquí

La pasarela será **Paddle**, que actúa como _merchant of record_: es el vendedor
legal frente al cliente, emite la factura y liquida el IVA de cada país. Por eso:

- La web **muestra el precio final** e indica que los impuestos van incluidos.
- **No hay lógica fiscal propia**: ni tipos por país, ni facturación, ni OSS.
- A cambio, Paddle se queda una comisión mayor que Stripe. Es el precio de no
  gestionar el IVA de ventas digitales en la UE, que para una editorial de una
  persona es el mejor cambio posible.

Toda la relación con Paddle vivirá detrás de `src/lib/pagos/proveedor.ts`, con una
implementación simulada para desarrollo y tests. Cambiar de pasarela debe ser
tocar un solo fichero.

### Modo oscuro con script en línea

El tema se decide en un script de cuatro líneas en `<head>`
(`src/components/layout/ScriptTema.tsx`). Leer una cookie en el layout raíz
obligaría a renderizar en servidor cada visita y el sitio dejaría de ser estático,
que es justo lo que lo hace rápido y gratuito.

### Sin fuentes externas

Fraunces e Inter se descargan en tiempo de build y se sirven desde nuestro
dominio. Verificado en la Fase 1: la home no hace **ninguna** petición a un host
externo.

---

## ⚠️ Aviso legal importante

Las páginas de `/legal/*` se entregarán como **plantillas** con marcadores
`[[RAZÓN SOCIAL]]`, `[[NIF]]` y `[[DIRECCIÓN]]`. Son un punto de partida, **no un
documento válido**.

**Antes de cobrar un solo euro, un abogado o asesor debe revisar** el aviso legal,
la política de privacidad, la de cookies, los términos de compra y la política de
reembolso. Lo mismo vale para el alta de la actividad y las obligaciones fiscales
del vendedor. Este repositorio no da asesoramiento legal ni fiscal.

En la misma línea: **no se publican reseñas inventadas**. Los testimonios de la
home son huecos marcados como pendientes, y el sitio no emite `aggregateRating`
hasta que existan valoraciones reales de lectores.
