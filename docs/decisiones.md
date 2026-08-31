# Decisiones · arrecife

Lo que sigue son los puntos donde el código y el documento **no** dicen lo mismo,
con la resolución y el motivo. En todos los casos de esta página gana el código:
hay que llevar estos valores al *Design System* y al *Manual de marca*, no al
revés.

Cada entrada dice qué había, qué quedó y por qué. Si alguna se revierte, se
revierte con un argumento nuevo, no por olvido.

---

## 1 · Un solo radio de control

**Documento:** `sm 8 · md 10 · lg 12`.
**Código:** `radius.control` (10) en los tres tamaños.

Escalonar el radio por tamaño exige tres tokens de radio para una diferencia de
dos píxeles. Un radio de control único es más fácil de defender y mucho más fácil
de mantener sincronizado entre cinco proyectos.

Lo que **sí** estaba mal y se corrigió es el padding horizontal, que ahora sale
del documento: `control.sm 14 · control.md 22 · control.lg 30`. Están en
`tokens.ts` como grupo propio y no dentro de `spacing`, porque 14, 22 y 30 no
componen con 8/12/16/26/40 y no deben ofrecerse como margen suelto.

**Acción en el documento:** quitar el escalonado de radio de la tabla de botones.

---

## 2 · La tarjeta no tiene superficie propia

**Documento:** «tarjeta · bg `#0B1620` sobre fosa, o fosa sobre abismo».
**Código:** la tarjeta es `surface`, y `#0B1620` no entra como token.

Un cuarto nivel de superficie sin par en modo claro es un token que miente en la
mitad de los proyectos: el generador emite las dos paletas, así que una clave que
solo existe en `dark` se queda con el valor oscuro cuando la página está en
claro. El documento tampoco da el equivalente claro.

Lo que **sí** estaba mal y se corrigió es el padding: las tarjetas del documento
llevan 26 (`lg`) y `CardHeader` ponía 16 (`md`). Cambió en `Card*` y en las tres
tarjetas de dominio.

**Acción en el documento:** borrar `#0B1620` de la sección de tarjetas.

---

## 3 · El radio del aviso

**Documento:** `r12`.
**Código:** `radius.card` (14).

12 no es ninguno de los cinco radios del sistema (`chip 6 · control 10 · card 14
· panel 16 · pill 999`). Entre estrenar un sexto radio para una pieza y usar el
de tarjeta —que es lo que un aviso es: un bloque de superficie con contenido—,
gana el de tarjeta.

**Acción en el documento:** cambiar `r12` por «radio de tarjeta» en la sección de
avisos.

---

## 4 · El tinte del aviso en modo claro

**Documento:** «fondo al 8 % del color semántico, borde al 22 %», calculado sobre
abismo. La auditoría sospechaba que sobre papel el 8 % no se vería y que haría
falta una segunda tabla para modo claro.

**Medido.** Contraste del tinte contra el fondo de página:

| tono | 8 % oscuro | 8 % claro |
|---|---|---|
| accent | 1.149 | 1.106 |
| success | 1.116 | 1.121 |
| warning | 1.126 | 1.109 |
| error | **1.067** | 1.120 |

El modo claro **no** necesita una segunda tabla: aguanta igual o mejor que el
oscuro en los cuatro tonos. La sospecha iba al revés.

El único punto flojo del sistema es `error` sobre abismo, 1.067, que es el tinte
más tenue de los ocho y se apoya entero en el borde al 22 %.

**Acción en el documento:** anotar que la receta 8/22 vale en los dos modos, y
que `error` oscuro es el caso límite.

---

## 4b · El texto sobre el tinte no puede ser el color del tinte

**Encontrado al implementar el punto 4**, no en la auditoría. La suite de
accesibilidad en modo claro lo tiró en cinco stories.

El título del aviso y el texto de la etiqueta de estado iban en el color
semántico, encima del fondo al 8 % de ese mismo color. En modo claro eso no puede
pasar AA nunca: los semánticos claros están calibrados para pasar **justo** sobre
papel, así que teñir el fondo con ellos los hunde por debajo de 4.5.

| tono | sobre papel | sobre su propio tinte 8 % | `textPrimary` sobre el tinte |
|---|---|---|---|
| accent | 4.55 | **4.12** | 14.82 |
| warm | 4.54 | **4.11** | 14.85 |
| success | 5.80 | 5.17 | 14.63 |
| warning | 4.88 | **4.40** | 14.78 |
| error | 4.87 | **4.35** | 14.64 |

No hay alfa que lo arregle: el problema es poner el color encima de sí mismo.

**Resolución:** el tinte es una **superficie**, así que el texto que lleva encima
es un token de texto. El título del aviso va en `textPrimary` y el color
semántico se queda donde no es texto — el borde y el glifo —, que es lo único que
el documento pedía de él. El glifo es decorativo y `aria-hidden`, así que le
aplica el umbral de 3:1 y no el de 4.5.

La etiqueta de estado, además, lleva el borde **sólido** en vez del 22 % del
aviso: a 13px y con dos palabras de ancho, el borde es lo único que dice de qué
tono es, y al 22 % no llegaba.

**Acción en el documento:** anotar que el color semántico no es color de texto
sobre su propio tinte, en ningún modo.

---

## 5 · La escala mono va a 13, no a 12.5

**Documento:** mono de metadatos a 12.5px.
**Código:** `typeScale.meta` a 13px.

`limits.minScreenPx` es 13 y `textMuted` lleva escrito «nunca bajo 13px». Esta
escala es justo donde se escriben las metas en muted —fechas, minutos de lectura,
nombres de archivo—, así que ponerla en 12.5 habría dejado ilegible su uso más
común por medio píxel.

Por el mismo argumento no entran los otros dos medios píxeles del documento: el
resumen de tarjeta a 15.5 usa `ui` (15) y el código en línea a 13.5 usa `meta`
(13).

**Acción en el documento:** subir la escala mono de metadatos a 13.

---

## 6 · El borde de la categoría sale de la paleta

**Documento:** borde `#4A3A25`.
**Código:** `warm/28`.

`#4A3A25` es arena al 28 % sobre abismo (`#4A3C2B`, dos puntos de diferencia en
verde y seis en azul). Un hex literal para lo que ya es un token con alfa es un
token de más, y además el literal no tendría equivalente en modo claro: la misma
regla al 28 % da arena oscura sobre papel, que es lo que se quiere.

**Acción en el documento:** cambiar el hex por «arena al 28 %».

---

## 7 · El terciario mono usa la escala, no 14px

**Documento:** JetBrains Mono 14px.
**Código:** la escala del tamaño del botón — `text-ui` (15) en `md`, `text-label`
(13) en `sm`.

Es el mismo argumento del punto 5: un escalón nuevo por un píxel de diferencia
convierte la escala en una lista de tamaños. El formato del texto (`./acción →`)
sí es parte de la variante y sí está en el código.

**Acción en el documento:** dar el terciario en la escala del control, no en un
tamaño absoluto.

---

## 8 · No hay botón de peligro

Ninguna de las 987 líneas del documento muestra un destructivo, y el error del
sistema vive en los avisos y en la validación de campo. La variante `danger` que
había en el código se borró.

Si el admin del blog necesita un destructivo real, entra **primero** en el
documento y luego aquí.

---

## 9 · Los degradados claros están inventados

El documento da los dos degradados oscuros y ninguno claro:

```
hero    linear-gradient(160deg, #091319 60%, #0d2129 100%)
seccion linear-gradient(150deg, #10202b 0%, #0d2129 100%)
```

Ya son tokens (`gradient.dark`), y `#0D2129` vive dentro de `tokens.ts` como
constante privada del degradado: no es superficie ni color de texto, así que no
entra en la paleta.

Los claros (`gradient.light`) se componen de la paleta clara con los mismos
ángulos y las mismas paradas, porque si no el hero se queda plano en modo claro.
**Es lo único de esta página que está pendiente de ratificar y no de corregir:**
son valores nuevos, no una corrección al documento.

**Acción en el documento:** decidir los dos degradados claros — o confirmar los
compuestos.

---

## 10 · La escala de etiqueta rompe el suelo de 13px, a propósito

**Documento:** categoría mono 11.5, estado sans 12.5/500.
**Código:** `typeScale.chip` (11.5) y `typeScale.tag` (12.5).

`limits.minScreenPx` es 13, y en el punto 5 de esta misma página ese suelo ganó.
Aquí pierde, y la diferencia es qué se está midiendo: el suelo protege al TEXTO
—lo que se lee dentro de una frase—, y una píldora de una palabra no es texto
corrido, es una marca. El contraste, que es la parte que no se negocia, sigue
medido y pasa AA: plancton 5.57:1 sobre abismo.

A 13 las tres familias salían del tamaño de un botón pequeño y pesaban más que
el título que acompañan.

**Acción en el documento:** ninguna. El documento tenía razón.

---

## 11 · El skeleton sí se mueve

**Documento:** shimmer 1.4s lineal.
**Código:** lo tenía quieto, con el argumento escrito de que «el sistema no
anima».

Gana el documento. Es la TERCERA y última excepción de movimiento, junto al
spinner del botón y el panel lateral, y las tres pasan el mismo filtro: son
realimentación de PROGRESO, no de estado. Un bloque quieto y un bloque que nunca
va a cargar se ven exactamente igual.

Va detrás de `motion-safe`, así que se apaga solo para quien pidió menos
movimiento, y `still` lo apaga a mano para las listas largas — veinte filas
barriendo a la vez son un estroboscopio, no una carga.

**Acción en el documento:** ninguna, pero conviene que el documento diga que son
tres excepciones y cuáles.

---

## 12 · La aleta de las OG no es un parámetro

El propio documento lo avisa: «es el error más fácil de cometer en un generador,
porque el fondo es un parámetro». Espuma en las tres plantillas oscuras, dos
azules en la de curso.

En `src/og/plantillas.ts` la aleta la elige el modo de la plantilla, no quien la
llama. Es la misma decisión que `Isotipo` con `sobre`: no existe forma de pedir
la combinación mala.

Segundo detalle de la misma retícula: la mascota se **ancla** al borde en vez de
ocupar una columna. Con la mascota compitiendo por el ancho, el titular se
quedaba en un tercio del lienzo y se truncaba a media palabra en vez de las tres
líneas del documento.

**Acción en el documento:** ninguna.

---

## 13 · Dos radios que el documento da fuera de la escala

`r8` para el contenedor del reproductor y `r12` para el aviso. Los cinco radios
del sistema son `chip 6 · control 10 · card 14 · panel 16 · pill 999`.

El aviso usa `card` (punto 3) y el reproductor usa `control`, que es el más
cercano a 8. Ninguno estrena un sexto radio.

**Acción en el documento:** dar los dos en nombres de radio, no en píxeles.

---

## 14 · El botón grande va a 17

**Documento:** los tres tamaños de botón llevan texto de 13.5 / 15 / **17**px.
**Código:** `sm` usa `label` (13), `md` usa `ui` (15) y `lg` usa `lead` (17).

Entra el escalón. Lo que lo justifica no es el botón: es que el documento usa 17
DOS veces y en piezas distintas — «lg 15px 30px r12» con texto de 17, y «h1
44/700 · **bajada 17px** · párrafo de contexto 15px» en las páginas internas. Un
solo uso no habría justificado partir la distancia entre `ui` (15) y `body` (18);
dos sí.

**Acción en el documento:** ninguna.

---

## 15 · `cn` deriva las escalas, ya no las repite

No es una divergencia con el documento: es un bug que el propio `cn.ts` había
predicho y que se cumplió.

`tailwind-merge` no conoce la escala de Arrecife, y `text-` es ambiguo entre
tamaño y color. Sin declararla, `text-tag` parece un COLOR, así que en
`cn('text-tag', 'text-text-primary')` gana el último y el tamaño desaparece: la
clase queda escrita en el componente y no llega al DOM.

`cn.ts` mantenía la lista «a mano y a propósito», y se desincronizó dentro de una
sola sesión: `stat`, `meta`, `tag`, `chip` y `lead` entraron en `typeScale` y no
en esa lista. Las cinco se caían en cualquier pieza que además pidiera un tono —
que son casi todas. **Los badges renderizaban a 16px heredados en vez de a 12.5**,
y la línea de metadatos de `ArticleCard` llevaba rota desde que se movió a `meta`.

Lo mismo con `px-control-*`: al no estar en el grupo `px`, no entraba en
conflicto con el `px-0` del terciario y ganaba el orden del CSS, no la intención.

Ahora los grupos se derivan de `tokens.ts` con `Object.keys`. Añadir un escalón
ya no puede olvidarse aquí porque aquí no hay nada que añadir.

**Lección, y va al documento del equipo antes que al de diseño:** una lista que
hay que mantener sincronizada a mano con otra lista termina desincronizada. Si se
puede derivar, se deriva.

---

## 16 · El ritmo de página lleva `step` en el nombre

**Documento:** la escala de espaciado es `xs 8 · sm 12 · md 16 · lg 26 · xl 40`.
**Código:** los mismos cinco valores, con los nombres `stepXs`…`stepXl`.

Esta no es una discrepancia de criterio: es un choque de nombres con Tailwind, y
los valores no se mueven ni un píxel.

En Tailwind v4 el nombre de la custom property **es** la API, y `--spacing-*` no
alimenta solo `p-*`, `m-*` y `gap-*`: también resuelve `w-*`, `h-*`, `max-w-*`,
`min-w-*`, `max-h-*`, `min-h-*`, `basis-*` y `size-*`, donde **gana** a la escala
`--container-*`. Nuestros escalones se llamaban exactamente igual que esa escala,
así que en cualquier proyecto que importara `theme.css`:

| Clase | Tailwind | Con arrecife 0.2.0 |
| --- | --- | --- |
| `max-w-sm` | 384px | **12px** |
| `max-w-md` | 448px | **16px** |
| `max-w-lg` | 512px | **26px** |
| `max-w-xl` | 576px | **40px** |

Redeclarar `--container-sm` y compañía **no** lo arregla: se probó, y `--spacing-*`
gana igual. La única salida era que la librería dejara de usar esos nombres.

El prefijo sigue el patrón que ya tenía `control` —un grupo con nombre propio
dentro de `--spacing-*`, que da `px-control-md`—, así que no estrena una forma:
la extiende. `section` se queda sin prefijo porque no choca con nada.

**Lo que hay que quedarse, que es más importante que el rename:** el bug no lo
detectó nada. Ni el build, ni los tipos, ni Storybook, ni la suite de axe en los
dos modos. Vivía en el hueco entre lo que la librería **publica** y lo que la
librería **usa**: Arrecife no escribe `max-w-sm` por dentro, así que ninguna
story podía enseñarlo. Se descubrió en producción, en `cursos.eduardoalvarez.dev`,
con el párrafo de un hero saliendo a una palabra por línea.

De ahí las dos defensas nuevas, y son dos porque son razonamientos independientes:

- `scripts/check-tokens-namespace.mjs` falla el build si un token nuestro pisa un
  nombre que Tailwind reserva. La lista de nombres no está escrita a mano: se lee
  del `theme.css` de la versión instalada, así que un escalón nuevo de Tailwind se
  detecta al actualizar la dependencia.
- `scripts/theme-css.test.mjs` compila Tailwind de verdad con los tokens encima y
  comprueba a qué resuelve cada utilidad. Es la primera prueba del repo que mide
  lo que se publica y no lo que se usa.

La guía para los proyectos que consumen la librería está en
[`migracion-0.3.md`](migracion-0.3.md).

**Acción en el documento:** ninguna sobre los valores. Anotar en la tabla de
espaciado que la utilidad es `p-step-md`, no `p-md`.

---

## 17 · La pose del hero SÍ puede ir centrada, en una página que es solo eso

**Documento y código, hasta ahora:** «la pose sangra por el borde inferior
derecho, NUNCA centrada. Una mascota centrada bajo un titular es una ilustración
de portada, y esto es una cabecera».

**Qué quedó:** la regla sigue siendo el defecto —`variant="cabecera"`— y se le
añade `variant="centrado"`.

La regla se escribió contra el hero de una página con más contenido debajo, y ahí
es correcta. `links` no es esa página: es centrada de extremo a extremo, no tiene
nada más, y la mascota es el protagonista y no el remate. Ese proyecto no discutía
la regla, **se saltaba `Hero` entero**, que es el peor resultado posible: acabó
con una copia del degradado en otro repositorio, que es exactamente la clase de
desincronización por la que esta librería existe.

Una regla con nombre se discute; una copia no. La variante lleva la pose ARRIBA
del titular y no debajo, que es lo que la mantiene fuera del caso que la regla
prohíbe: no cierra un bloque de texto, lo encabeza.

**Acción en el documento:** anotar la excepción y su condición —página completa,
sin contenido después—, no la variante a secas.

---

## 18 · La paleta de series de gráfica no está en el documento

**Documento:** no dice nada. No hay gráficas en los canvas.

**Qué quedó:** `tokens.series`, cuatro colores por modo, ninguno nuevo.

`cursos` dibuja métricas con Recharts, y sin token cada gráfica elige sus colores:
es el fallo de la paleta de resaltado otra vez, con otro nombre. La alternativa
—no meter gráficas en la librería— deja el problema en pie, porque el proyecto va
a dibujarlas igual.

Los cuatro son bioluz, arena, `brand.body` y plancton. Tres decisiones detrás:

- **Cuatro, no cinco ni siete.** Es el mismo criterio que la paleta de sintaxis,
  que también son cuatro a propósito: el sistema se comunica con color y borde,
  no con ruido cromático. `colorDeSerie` da la vuelta pasada la cuarta, y que dos
  series compartan color es la señal correcta — sobran categorías.
- **Se distinguen por tono, no por luminosidad.** Turquesa, naranja, azul y gris.
  Bioluz y `success` habrían dado dos verdes casi idénticos en modo claro, y dos
  series indistinguibles para quien no separa rojo y verde.
- **`brand.body` entra aquí y no en el resaltado**, por la misma regla vista al
  derecho: el sistema lo restringe a relleno y nunca a texto, y una serie de
  gráfica es relleno. En el resaltado medía 4.2:1 y quedó fuera.

El umbral que aplica es el de objeto gráfico, 3:1 contra el fondo, no el de
texto. El peor de los ocho valores es `brand.body` sobre papel, 3.9:1.

**Acción en el documento:** añadir la paleta de series y la regla de las cuatro.

---

## 19 · La barra de progreso de lectura no es una barra de progreso

**Qué quedó:** `ScrollingProgressBar` va `aria-hidden` y sin `role="progressbar"`.

`Progress` mide una tarea: hay un total, alguien la empezó y va a terminar. La
barra de lectura mide una POSICIÓN en un documento, que se recorre en los dos
sentidos y de la que no hay nada que completar. Anunciar «37 %» a quien ya sabe
dónde está en el documento es ruido, no información.

Es la decisión contraria a la de `ChartContainer`, y conviene ver por qué no se
contradicen. Allí también se intentó `aria-hidden`, con el mismo argumento —«cada
tick no cuenta lo que la gráfica cuenta»— y estaba mal: la gráfica **es** el
contenido y además contiene elementos enfocables, así que esconderla mete el foco
en algo que no existe para quien escucha. La barra de lectura no es contenido y no
tiene nada enfocable dentro. La prueba es la suite: la versión con `aria-hidden`
del contenedor de gráficas tiró tres stories con `aria-hidden-focus`.

**Acción en el documento:** ninguna.

---

## Lo que NO se tocó

Sigue vigente la lista de la auditoría: las tres correcciones de contraste
(`textMuted` claro, `warning` claro, `error` oscuro), `Isotipo` con `sobre`
obligatorio, `Logo` sin prop de texto, `Text` sin prop `font`, `CodeBlock` con su
isla de tema, el `AudioPlayer` sin movimiento, `check-tokens-purity.mjs` en cada
build y el `data-theme` de la zona de previsualización en `marca.stories.tsx`.
