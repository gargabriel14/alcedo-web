# CONTENIDO.md — cómo se escribe el contenido de alcedo.com

Todo el contenido editorial vive en `/content`, en ficheros `.mdx`. Cada fichero es
una página. **No hace falta programar nada**: se edita texto, se guarda y la web se
regenera al desplegar.

```
content/
├─ libros/    Una ficha por libro   → /libro/<nombre-del-fichero>
├─ autores/   Una ficha por autor   → /autor/<nombre-del-fichero>
└─ blog/      Un artículo por fichero → /blog/<nombre-del-fichero>
```

El nombre del fichero **es la URL**. Elígelo con cuidado (en minúsculas, con
guiones, sin tildes) porque cambiarlo después rompe los enlaces.

---

## Cómo está montado un fichero

Dos partes separadas por `---`:

```mdx
---
titulo: Aquí van los datos, en formato YAML
---

Y aquí abajo el texto libre, en Markdown.
```

Lo de arriba se llama **frontmatter** y son los datos que la web usa para montar la
página (precios, índice, FAQ…). Lo de abajo es texto corrido.

### Las cuatro reglas de YAML que hay que respetar

1. **La sangría es con espacios, nunca con tabulador.** Dos espacios por nivel.
2. **Si un texto lleva dos puntos seguidos de espacio, ponlo entre comillas.**
   ```yaml
   titulo: 'Plantilla 1: generador de facturas'   # ✅ con comillas
   titulo: Plantilla 1: generador de facturas     # ❌ rompe el build
   ```
3. **Para textos largos, usa `>-`** y sangra las líneas siguientes. Así puedes
   escribir varias líneas sin preocuparte por comillas ni por los dos puntos:
   ```yaml
   gancho: >-
     El libro que te quita la carpeta de facturas de encima: trece plantillas
     encadenadas que van de la factura al trimestre presentado.
   ```
4. **Las fechas van en formato `AAAA-MM-DD`**, por ejemplo `2026-05-12`.

### Si algo está mal, el despliegue se para

A propósito. Verás un mensaje como este, que te dice el fichero y el campo exactos:

```
❌ Frontmatter inválido en content/libros/excel-para-autonomos-en-espana.mdx
  · resultados: Cinco resultados como mínimo: menos no convence
  · precios.pdf: El precio tiene que ser mayor que cero
```

Es mejor que una web publicada con un libro sin precio. Corriges y vuelves a subir.

---

## Ficha de libro

Crea el fichero con el script y así no te falta ningún campo:

```bash
pnpm nuevo-libro "Excel para fotógrafos" --sello=practico
```

### Ejemplo completo

```mdx
---
titulo: Excel para autónomos en España
subtitulo: De la factura al modelo 303 sin salir de una hoja de cálculo
sello: practico              # practico | vida | labs
autor: g-g-alcedo            # nombre del fichero en content/autores
estado: publicado            # publicado | en-preparacion
fecha: 2026-05-12
paginas: 184
destacado: true              # solo UNO en todo el catálogo: es el de la portada
gancho: >-
  El libro que te quita la carpeta de facturas de encima. Trece plantillas
  encadenadas que van de la factura emitida al trimestre presentado.
resultados:                  # entre 5 y 7, en verbo y concretos
  - Emitir facturas numeradas y con el IVA correcto desde una plantilla
  - Llevar el libro de ingresos y gastos que exige Hacienda
  - Sacar la cifra de cada casilla del modelo 303 en diez minutos
  - Separar gasto deducible de no deducible con una regla clara
  - Calcular tu precio por hora real
precios:
  pdf: 29                    # el que vendemos aquí
  kindle: 5.99               # el de Amazon
  tapaBlanda: 18.9           # opcional: quítalo si no hay edición impresa
promesaPdf: incluye las 13 plantillas de Excel editables; el Kindle, no
sku: pdf-excel-autonomos     # identificador del producto. Solo minúsculas y guiones
temas:                       # sirven para el filtro del catálogo
  - excel
  - impuestos
entregables:                 # lo que se descarga. Uno por línea, y cuantos más, mejor
  - titulo: Cuaderno de 13 plantillas de Excel editables
    tipo: excel              # excel | sheets | pdf | plantilla | checklist | calendario
  - titulo: Checklist trimestral del modelo 303
    tipo: checklist
indice:                      # el índice completo. Mínimo 3 capítulos
  - titulo: La factura que no te van a devolver
    pagina: 19               # opcional
    apartados:               # opcional
      - Los datos obligatorios, uno por uno
      - 'Plantilla 1: generador de facturas'
  - titulo: IVA sin misterio
    pagina: 43
    apartados: []
  - titulo: El trimestre en diez minutos
    pagina: 121
    apartados: []
muestras: []                 # páginas de muestra. Ver más abajo
faq:                         # mínimo 3. Son las objeciones que frenan la compra
  - pregunta: ¿Me sirve si uso Google Sheets?
    respuesta: >-
      Sí. Las plantillas van en los dos formatos, con las fórmulas ya adaptadas.
  - pregunta: ¿Esto sustituye a mi asesor fiscal?
    respuesta: >-
      No, y no lo pretende. Sustituye a la carpeta de facturas sin ordenar.
  - pregunta: ¿Y si cambia la normativa?
    respuesta: >-
      Actualizamos el PDF y te avisamos. Doce meses de actualizaciones incluidas.
portada: null                # ver más abajo
amazon:
  kindle: null               # pega aquí la URL de Amazon cuando exista
  tapaBlanda: null
---

Aquí, en Markdown, la descripción larga que sale en la ficha bajo «Sobre el libro».

### Para quién es

- Autónomos que facturan por su cuenta.

### Para quién no es

- Para sociedades con contabilidad de partida doble.
```

### Portada

Mientras `portada: null`, la web dibuja una portada tipográfica con el título, el
sello y el autor. Queda bien y deja claro que es provisional. Cuando tengas la
portada de verdad:

1. Guarda la imagen en `public/portadas/`, por ejemplo `public/portadas/excel.jpg`.
2. Rellena el campo:
   ```yaml
   portada:
     src: /portadas/excel.jpg
     alt: Portada de Excel para autónomos en España, de G. G. Alcedo
     ancho: 1200
     alto: 1800
   ```

El `alt` es obligatorio y describe la imagen para quien no puede verla. Proporción
recomendada 2:3.

### Páginas de muestra

Exporta dos o tres páginas del interior a JPG o WebP, guárdalas en
`public/muestras/<slug-del-libro>/` y añádelas:

```yaml
muestras:
  - src: /muestras/excel-para-autonomos-en-espana/pagina-45.jpg
    alt: Página 45, la plantilla del libro de ingresos y gastos
    ancho: 1240
    alto: 1754
```

El visor con ampliación se activa solo en cuanto haya al menos una.

---

## Ficha de autor

```mdx
---
nombre: G. G. Alcedo         # el nombre que se muestra. Si firmas con iniciales, aquí van
rol: Autor y fundador de Editorial Alcedo
bioCorta: Escribe las guías prácticas que le habría gustado encontrar cuando le tocó resolverlo solo.
bioMedia: >-
  Dos o tres frases. Es la bio que sale en la ficha de sus libros y al pie de sus
  artículos.
sellos:                      # opcional
  - practico
  - vida
enlaces: []                  # perfiles públicos (URL completas), para el SEO
foto:                        # opcional: null y se muestra el monograma
  src: /autores/g-g-alcedo.svg
  alt: Retrato de G. G. Alcedo, autor y fundador de Editorial Alcedo
  ancho: 800
  alto: 800
---

La biografía larga, en párrafos de Markdown. Es lo que se lee en /autor/<slug>.
```

Para cambiar la foto, sustituye el fichero de `public/autores/` por un JPG o WebP
cuadrado de 800 px como mínimo y actualiza `src`.

---

## Artículo del blog

```mdx
---
titulo: Cómo calcular las casillas del modelo 303 en una hoja de cálculo
descripcion: >-
  Entre 80 y 180 caracteres. Es el texto que sale en Google, así que tiene que dar
  ganas de entrar y decir la verdad de lo que hay dentro.
fecha: 2026-06-18
actualizado: 2026-07-01      # opcional, si lo revisas más adelante
autor: g-g-alcedo
sello: practico
temas:
  - impuestos
  - excel
libroRelacionado: excel-para-autonomos-en-espana   # obligatorio: al final del artículo se enlaza
recursoRelacionado: plantilla-iva-trimestral-autonomos   # opcional: el de <Captura />
imagen: null
borrador: false              # true = visible por su URL pero fuera del listado y de Google
---

## Los titulares de nivel 2 forman el índice lateral

El índice de la derecha se genera solo con los `##` y los `###`. No hay que
mantenerlo a mano.

<Captura />

El bloque de captura de correo se coloca escribiendo esa etiqueta donde quieras,
normalmente a mitad del artículo. Coge automáticamente el lead magnet que hayas
puesto en `recursoRelacionado`. Si no has puesto ninguno, no se pinta nada.

## Lo que se puede usar en el texto

- **negrita**, *cursiva*, `código`
- listas con guiones y listas numeradas
- tablas y citas con `>`
- enlaces normales de Markdown
```

### Consejos de estilo Alcedo

- Empieza por el problema del lector, no por la explicación.
- Una idea por párrafo. Frases cortas.
- Si algo no se puede hacer, dilo (y di qué sí se puede).
- Cada artículo termina llevando a un libro. El bloque final es automático.
- Nada de «en este artículo veremos». Ve al grano.

---

## Publicar los cambios

1. Guarda los ficheros.
2. Comprueba en local con `pnpm dev`.
3. Sube los cambios a GitHub. Vercel despliega solo y en un minuto está en línea.

Si el despliegue falla, el mensaje de error dice el fichero y el campo. No hay
manera de publicar una ficha incompleta sin darse cuenta, y eso es intencionado.
