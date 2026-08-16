# alcedo-web — reglas del repositorio

Web y tienda de **Editorial Alcedo**. Antes de tocar nada, lo que hay que saber
para no romper algo que cuesta dinero.

El contexto de negocio está en [PLAN.md](PLAN.md) y la guía de contenido en
[CONTENIDO.md](CONTENIDO.md). Este fichero solo contiene **reglas**.

---

## Las siete reglas que no se negocian

### 1. El precio nunca viene del cliente

Del navegador llega un **SKU**, jamás un importe. El precio se busca en
`content/productos/*.mdx` en el servidor. Esta regla está probada en
`tests/unidad/pagos.test.ts`: un evento manipulado con `importeCentimos: 1` sigue
generando un pedido de 2900.

Si escribes código que acepta un importe de fuera, lo estás haciendo mal.

### 2. Nadie importa un SDK de pago fuera de `src/lib/pagos/`

Toda la pasarela vive detrás del contrato de `src/lib/pagos/proveedor.ts`
(`crearCheckout`, `verificarWebhook`, `normalizarPedido`). Cambiar Paddle por
Lemon Squeezy debe ser escribir una clase nueva al lado de `paddle.ts`, no tocar
rutas ni componentes.

Para comprobarlo hay que mirar **las importaciones**, no la palabra: «Paddle»
aparece en comentarios de rutas y componentes con toda legitimidad.

```bash
# Debe salir vacío. Busca importaciones reales, no menciones.
grep -rnE "from ['\"][^'\"]*(paddle|stripe|lemonsqueezy)" src/ \
  --include=*.ts --include=*.tsx | grep -v "src/lib/pagos/"
```

### 3. Nunca se publica una reseña que no existe

Ni testimonios inventados, ni `aggregateRating` en el JSON-LD sin valoraciones
reales. Es publicidad engañosa (Ley 3/1991) y Google penaliza el dato falso.

Los huecos de la home van marcados con `[[RESEÑA PENDIENTE]]` a propósito.

### 4. El IVA no se calcula aquí

La pasarela es *merchant of record*: es el vendedor legal, emite la factura y
liquida los impuestos. La web **muestra el precio final** y dice que van
incluidos. Cero lógica fiscal propia.

### 5. Los plazos salen de `src/lib/garantia.ts`

Los 14 días de garantía y los 12 meses de actualizaciones se leen de ese módulo,
que es el mismo que decide si siguen vigentes para una compra concreta. **Nunca
escribas «14 días» a mano en un componente**: el texto de venta y el sistema no
pueden divergir.

### 6. El contenido se valida en el build

`/content` se lee con Zod y el build **se para** si falta un campo obligatorio o
si un precio no cuadra entre el libro y su producto. Eso es una funcionalidad, no
un estorbo: no lo relajes para que pase un fichero a medias.

### 7. Modo local honesto

Sin credenciales de Supabase o Resend, la aplicación guarda en memoria y escribe
los correos por consola — y **lo dice en pantalla**. Nunca finjas que se guardó o
se envió algo. Si añades una integración, mantén ese patrón.

---

## Convenciones

| Qué | Cómo |
| --- | --- |
| **Idioma del código** | Español: nombres de funciones, variables, componentes, ficheros y comentarios. Se mantienen en inglés las palabras del framework (`page.tsx`, `layout.tsx`, `useState`). |
| **Idioma de la interfaz** | Español de España. |
| **Componentes** | De servidor por defecto. `"use client"` solo cuando hay estado, evento o API del navegador, y con el porqué en un comentario. |
| **Estilos** | Tailwind con **tokens semánticos** (`bg-fondo`, `text-texto-tenue`, `border-borde`). Nunca `dark:` repartido: el token cambia de valor y el componente no se entera. |
| **Colores de sello** | Literales en `src/lib/sellos.ts`. Nunca `bg-sello-${clave}`: Tailwind escanea el código y no lo encontraría. |
| **Comentarios** | Explican **por qué**, no qué. Un comentario que repite el nombre de la función sobra. |
| **Commits** | En español, en imperativo, pequeños. |
| **Tests** | Vitest para lógica en `tests/unidad/`, Playwright para los dos flujos que dan dinero en `tests/e2e/`. |

---

## Antes de dar algo por terminado

```bash
pnpm verificar
```

Corre tipos, lint, tests de lógica y build. **Todo verde o no está hecho.** Los de
navegador van aparte porque tardan más:

```bash
pnpm test:e2e
```

CI ejecuta los dos en cada push y en cada pull request
(`.github/workflows/verificar.yml`).

---

## Trampas conocidas

- **Un fichero `"use server"` solo puede exportar funciones asíncronas.** Las
  constantes de estado viven en `estados.ts` / `estado.ts` al lado. Si exportas un
  objeto desde un fichero de acciones, el build se cae con un mensaje que no lo
  dice claro.
- **YAML del frontmatter:** un texto con `: ` dentro necesita comillas, y las
  fechas sin comillas se convierten en `Date` (el esquema ya lo normaliza).
- **`{}` en MDX es JSX.** Un `## Título {#ancla}` revienta el parseo; usa
  `<span id="ancla" />` antes del titular.
- **El almacén en memoria cuelga de `globalThis`.** Next empaqueta cada ruta por
  separado y el estado de módulo no se comparte entre ellas.
- **Avisos de hidratación con `darkreader` o similares** son extensiones del
  navegador, no fallos del código.

---

## Lo que este repositorio NO hace

No añadas nada de esto sin hablarlo: CMS de pago, librería de componentes
completa, librería de animación, lógica fiscal propia, scripts de analítica de
terceros, ni cookies no esenciales.
