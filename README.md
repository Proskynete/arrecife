# Arrecife

Librería de componentes de la identidad visual de Eduardo Álvarez.
`@eduardoalvarez/arrecife` · React 19 · TypeScript · shadcn/ui · Storybook · tsup.

## Los documentos de identidad

`docs/design-system.md` y `docs/manual-de-marca.md` son la extracción de los dos
canvas de Claude Design, en el repo para poder hacer `grep` y para versionarlos.
El canvas sigue siendo la fuente; esto es la copia consultable.

Está aquí por un motivo concreto: la paleta de resaltado vivía escrita a mano en
un proyecto con un `#E05252` que este README declara incorrecto desde hace
meses, y nadie lo vio porque el documento no era `grep`-able desde el código.

`docs/decisiones.md` es la otra mitad: los quince puntos donde el código y el
documento no dicen lo mismo, con la resolución y el motivo de cada uno.

## Los dos documentos para agentes

`AGENTS.md` es para un agente que trabaja **en este repo**: cómo se crea un
componente, qué reglas no puede romper y dónde se verifica cada una. `CLAUDE.md`
es un symlink a ese archivo, así que Claude, Codex y Cursor leen el mismo texto.

`llms.txt` es para un agente que trabaja en uno de los **cinco proyectos que
consumen** la librería. Ese agente nunca ve este repo: ve
`node_modules/@eduardoalvarez/arrecife/`, y por eso `llms.txt` viaja en el
tarball y se declara en `exports`.

El inventario de componentes y props de `llms.txt` no está escrito a mano: lo
extrae `scripts/build-llms.mjs` del compilador de TypeScript, y `pnpm check:llms`
falla en CI si alguien cambia un prop y no lo regenera. La prosa vive en
`docs/llms.plantilla.md`. Es la misma decisión que los tokens: una fuente, una
salida generada, y un check que impide que discrepen.

## La restricción que manda sobre todo lo demás

`src/tokens/` no importa nada: ni React, ni componentes, ni CSS de terceros. Es el
único subpaquete que pueden consumir los cinco proyectos, incluido un generador
de OG con Satori y un sitio Astro que no monta React. Si un token termina
dependiendo de un componente, la librería dejó de ser portable.

No es documentación: `pnpm check:tokens` lo verifica en cada build y ESLint lo
dice en el editor.

## Salida de Tailwind

Una sola fuente, `src/tokens/tokens.ts`. Una salida generada,
`dist/tokens/theme.css`, con `@theme` para Tailwind v4. La genera
`scripts/build-tokens.mjs`; no se edita a mano y se regenera en cada build.

Decisión de la Fase 0: **solo v4**. El portfolio (`eduardoalvarez.dev`) migra de
Tailwind v3 a v4 antes de consumir Arrecife. Si esa migración se atrasa, volver a
publicar el preset de v3 es añadir un emisor más a `build-tokens.mjs` que lea el
mismo objeto `tokens`: la fuente no cambia.

### Consumo

```css
@import "tailwindcss";
@import "@eduardoalvarez/arrecife/tokens/theme.css";
```

El modo oscuro es el primario y es el default. Un proyecto en modo claro declara
`data-theme="light"` en `<html>`; uno oscuro no necesita declarar nada.

Las familias tipográficas se declaran por nombre. Cada proyecto carga Bricolage
Grotesque, Geist y JetBrains Mono como prefiera: la librería no impone cómo.

### Mapa de tokens a utilidades

| Token | Custom property | Utilidad |
| --- | --- | --- |
| `colors[modo].surfaceRaised` | `--color-surface-raised` | `bg-surface-raised` |
| `brand.hull` | `--color-brand-hull` | `bg-brand-hull` |
| `typeScale.h1` | `--text-h1` | `text-h1` (arrastra line-height, weight y tracking) |
| `fonts.display` | `--font-display` | `font-display` |
| `radius.card` | `--radius-card` | `rounded-card` |
| `spacing.lg` | `--spacing-lg` | `p-lg`, `gap-lg`, `mb-lg` |
| `control.md` | `--spacing-control-md` | `px-control-md` (padding de botón) |
| `control.icon` | `--spacing-control-icon` | `size-control-icon` (botón de icono 42×42) |
| `gradient[modo].hero` | `--gradient-hero` | `degradado-hero` (utilidad, sigue el modo) |
| `size.nav` | `--spacing-nav` | `h-nav` |
| `size.content` / `size.wide` | `--container-content` / `--container-wide` | `max-w-content` / `max-w-wide` |
| `limits.measure` | `--container-measure` | `max-w-measure` |
| `shadow.standard` | `--shadow-standard` | `shadow-standard` |
| `motion` | `--duration-standard`, `--ease-standard` | `duration-standard`, `ease-standard` |

El variante `light:` está disponible para los casos del modo claro invertido.

También se puede consumir el objeto en JS, sin CSS y sin React — es lo que usan
las plantillas de OG:

```ts
import { tokens } from '@eduardoalvarez/arrecife/tokens';
```

El tema de resaltado va en otra subruta por la misma razón — se consume desde
`astro.config.mjs`, no desde un componente:

```ts
import { arrecife } from '@eduardoalvarez/arrecife/shiki';

export default defineConfig({
  markdown: { syntaxHighlight: 'shiki', shikiConfig: { theme: arrecife } },
});
```

**La librería no trae Shiki.** Los proyectos ya resaltan en build con su propia
herramienta; lo que les faltaba no era un resaltador, era el tema. `CodeBlock`
sigue recibiendo el código ya resaltado, que es para lo que está escrito.

Las plantillas de OG se publican en su propia subruta por la misma razón: un
generador corre en un worker o en un script de build y no debe arrastrar React ni
un solo componente.

```ts
import satori from 'satori';
import { plantillaArticulo, OG } from '@eduardoalvarez/arrecife/og';

const svg = await satori(plantillaArticulo({ title, date, readingMinutes }), {
  width: OG.width,   // 1200
  height: OG.height, // 630
  fonts: [...],
});
```

Son funciones puras que devuelven el árbol que Satori pinta, construido solo con
tokens. `dist/og/index.js` no menciona React en ninguna línea, y eso es
comprobable con un `grep`.

## Cómo se usa desde un proyecto

```tsx
import { Text, Button, Badge, cn } from '@eduardoalvarez/arrecife';
import type { TextProps } from '@eduardoalvarez/arrecife';

<Text variant="eyebrow" tone="muted">charlas</Text>
<Text as="h2" variant="h1">Escalar con criterio</Text>
<Text variant="body">Se corta solo a 68ch.</Text>
<Text variant="ui" measure={false}>Sin corte, para una celda estrecha.</Text>
```

Cada componente publica su página de documentación en Storybook con la tabla de
props generada desde los tipos. Las de `Text`:

| prop | tipo | por defecto |
| --- | --- | --- |
| `variant` | `display · stat · h1 · h2 · h3 · body · lead · ui · label · tag · meta · chip · eyebrow` | `body` |
| `tone` | `primary · secondary · muted · accent · warm · success · warning · error` | `primary` |
| `as` | `h1 · h2 · h3 · h4 · p · span · strong · em · figcaption · caption · legend · dt · dd · li` | según `variant` |
| `measure` | `boolean` — corta a 68ch | `true` en `body` |
| `asChild` | `boolean` — renderiza el hijo, para envolver un enlace | `false` |

Comprobado empaquetando la librería con `pnpm pack` e instalándola en un proyecto
aparte: los tipos resuelven desde `dist/`, `./tokens` carga sin arrastrar React y
`./tokens/theme.css` se resuelve por subruta.

## Scripts

| | |
| --- | --- |
| `pnpm build` | verifica la pureza de tokens, compila con tsup y genera `theme.css` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint, incluido el veto a hex literales fuera de `tokens.ts` |
| `pnpm check:tokens` | falla si `src/tokens/` importa algo de fuera |
| `pnpm test` | corre axe sobre las 161 stories, en los dos modos |
| `pnpm check:exports` | verifica que `dist/` tiene lo que `exports` promete |
| `pnpm check:release` | valida `release-please-config.json` contra el esquema oficial |
| `pnpm storybook` | genera los tokens y levanta Storybook en el 6006 |

## El contraste como test, no como panel

`pnpm test` monta cada story en un Chromium real y le pasa axe con
`a11y: { test: 'error' }`. Corre dos veces, una por modo: un color solo falla en
uno de los dos, así que pasar en oscuro no prueba nada sobre el claro.

Está comprobado que no es decorativo: devolver `textMuted` claro a su valor
anterior tira ocho stories con «insufficient color contrast of 4.24».

Hay una sola regla desactivada, en dos stories concretas y con el motivo escrito
al lado: `aria-hidden-focus` en `Select`/`DropdownMenu` abiertos. Radix marca
`aria-hidden` todo lo que queda fuera del portal y deja el disparador dentro
siendo focusable; el foco está atrapado por su `FocusScope`, así que no se puede
tabular hasta él. Es un desacuerdo conocido entre axe y Radix.

## Correcciones de contraste

El documento de identidad medía todo contra `background`. Pero `surfaceRaised`
es el peor caso en los **dos** modos: en claro es más oscuro que el fondo de
página, en oscuro es más claro. Es donde viven menús y tabs activos.

| token | antes | ahora | motivo |
| --- | --- | --- | --- |
| `light.textMuted` | `#6B7480` | `#626A75` | 4.24 no llegaba a AA sobre papel |
| `light.warning` | `#9A6A12` | `#8D6111` | 4.23 no llegaba a AA sobre papel |
| `dark.error` | `#E05252` | `#E15757` | 4.35 sobre `surface`, que es donde va un error de formulario |

Los tres conservan tono y saturación exactos: solo cambia la luminosidad entre
uno y cuatro puntos. `accent` y `warm` claros no se tocan.

Token nuevo: `hairlineHover` — `#2C4D5D` en oscuro (el valor de la regla 6) y
`#D3C8B2` en claro, derivado de igualar el salto perceptual (ΔL\* 10.5) en vez
de la razón de contraste, que cerca del blanco se pasa de frenada.

`textMuted` no va nunca sobre `surfaceRaised`: en oscuro da 4.07. Los menús usan
`textSecondary`, que da 6.96.

### La tercera corrección: el color semántico no es color de texto sobre su tinte

Salió al implementar la receta de avisos del documento — fondo al 8 % del color
semántico — y la tiró la suite en modo claro, en cinco stories.

Los semánticos claros están calibrados para pasar **justo** sobre papel. Teñir el
fondo con ellos los hunde por debajo de AA:

| tono | sobre papel | sobre su propio tinte 8 % | `textPrimary` sobre el tinte |
| --- | --- | --- | --- |
| `accent` | 4.55 | **4.12** | 14.82 |
| `warm` | 4.54 | **4.11** | 14.85 |
| `success` | 5.80 | 5.17 | 14.63 |
| `warning` | 4.88 | **4.40** | 14.78 |
| `error` | 4.87 | **4.35** | 14.64 |

No hay alfa que lo arregle: el problema es poner el color encima de sí mismo. La
resolución no toca la paleta — el tinte es una **superficie**, así que el texto
que lleva encima es un token de texto. El color semántico se queda donde no es
texto: el borde y el glifo.

El 8 %, por cierto, aguanta igual o mejor sobre papel que sobre abismo (1.106 vs.
1.149 en acento). La sospecha de que el modo claro necesitaba una segunda tabla
iba al revés: el punto flojo del sistema es `error` sobre abismo, 1.067.

## Publicar una versión

**No hay pasos manuales.** El tag, el CHANGELOG y el bump de versión los hace
release-please a partir de los commits convencionales que ya se escriben —y que
`lint-pr-title` ya obliga a escribir bien.

El ciclo, entero, está en `.github/workflows/release.yml`:

1. Mergeas un PR a `main` con un título tipo `feat(badge): …`.
2. release-please abre —o actualiza— un PR llamado `chore: versión X.Y.Z` con el
   bump en `package.json` y la entrada nueva del `CHANGELOG.md`. Ese PR se queda
   abierto y se va acumulando con cada merge, así que puedes juntar varios
   cambios en una versión.
3. Cuando lo mergeas, corta el tag, crea el release y dispara la publicación.
4. Antes de subir nada, el workflow comprueba que el tag y `package.json`
   coinciden, y corre lint, tipos, build, la verificación de `exports` y la
   suite completa en los dos modos.

`feat:` sube la minor y `fix:` la patch. Mientras la versión sea `0.x`, un
cambio que rompe sube la **minor** y no la major: eso es lo que significa el
`0.` — que la API todavía se puede mover sin gastar la 1.0. Está en
`release-please-config.json`, y ahí también está `initial-version` con el `0.1.0`
de la primera versión.

Cuando la API se estabilice, se sube a `1.0.0` a mano una vez y a partir de ahí
un `BREAKING CHANGE:` sube la major como en cualquier paquete.

### Cómo release-please decide qué cortar

Dos datos, y salen de sitios distintos. Saberlo evita el único fallo que deja el
release atascado:

| Dato | De dónde sale |
| --- | --- |
| La **versión** | Del **título** del PR — `chore(main): release 0.2.0` |
| El **componente** | Del **nombre de la rama** — `release-please--branches--main--components--arrecife` |

El componente lo deriva de `package.json` y **no se puede fijar por
configuración**: no existe una clave `component` en el
[esquema oficial](https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json).
`include-component-in-tag: false` es lo que hace que el tag sea `v0.2.0` y no
`arrecife-v0.2.0`.

Si el título o la rama se editan a mano y dejan de casar, release-please no crea
el release y cada run termina en `There are untagged, merged release PRs
outstanding - aborting`. De ahí no se sale con configuración: hay que cortar el
tag y el release a mano y reetiquetar el PR a `autorelease: tagged`.

`pnpm check:release` valida la configuración contra ese esquema en cada CI.
Existe porque release-please **ignora en silencio** las claves que no conoce: una
opción inventada no da error, no sale en el log y no hace nada.

### La publicación de confianza

El workflow publica con **OIDC**: GitHub emite un token que prueba «este build
salió de este repo y de este workflow», y npm lo cambia por permiso de
publicación. No hay ningún secreto de larga vida que robar, ni que rotar. De
paso genera la **procedencia**, que firma el paquete con un enlace verificable a
ese commit exacto.

Se configura una vez, en npmjs.com → el paquete → *Settings* → *Trusted
publisher*:

| Campo | Valor |
| --- | --- |
| Publisher | GitHub Actions |
| Organization or user | `Proskynete` |
| Repository | `arrecife` |
| Workflow filename | `release.yml` |
| Environment | `npm` |

Ese *Workflow filename* es la razón de que el release y la publicación vivan en
un solo archivo en vez de en un workflow reutilizable: npm casa el token contra
un nombre, y con `workflow_call` hay dos candidatos.

**El huevo y la gallina.** No se puede configurar un publicador de confianza en
un paquete que todavía no existe, así que la primera versión necesita token:

1. Crea el entorno `npm` en la configuración del repo con el secreto
   `NPM_TOKEN` (un token de tipo *automation*).
2. Sube la versión y publica la primera vez. El workflow avisa en el log de que
   está usando token.
3. Configura la publicación de confianza con la tabla de arriba.
4. **Borra el secreto `NPM_TOKEN`.** El paso que lo usa se salta solo cuando no
   está, y OIDC toma el relevo sin tocar ni una línea del workflow.

Para probar sin gastar una versión: *Actions → Release y publicación → Run
workflow* con el ensayo activado. Hace todo menos publicar, no necesita token, y
el resumen del run lista qué archivos viajarían y cuánto pesa el tarball.

## Estado

- **Fase 1** · andamiaje, tokens y Storybook con el switch de tema. Completa.
- **Fase 2** · `brand/`. Completa con los PNG que ya existían.
- **Fase 3** · los 18 primitivos sobre shadcn/Radix, más `Text` y ocho añadidos
  después de medir el uso real en los cinco proyectos. Completa.
- **Fase 4** · `AudioPlayer`, migrado. Completa.
- **Fase 5** · completa. `ArticleCard`, `AuthorCard`, `TalkCard`, `CourseCard`,
  `LinkRow`, `CodeBlock`, `Blockquote`, `PageHeader`, `EmptyState`, `Breadcrumb`,
  `Nav`, `SidebarNav`, `TableOfContents`, `Stat`, `Footer`, `Hero`,
  `NewsletterForm`, `og/` y `shiki/`.

  El criterio para decidir qué entra sigue siendo el mismo: **codifica una regla
  de identidad, tiene dos o más consumidores, y no arrastra infraestructura del
  proyecto.**

### `Hero` y `NewsletterForm` volvieron a entrar

Estaban fuera de la lista con un argumento escrito, y el argumento se revisó.

**`Hero`.** Se había descartado porque «el hero del portafolio y el de cursos son
el mismo esqueleto que una cabecera de sección, y `PageHeader` los cubre con una
prop de escala». Eso vale para el texto y solo para el texto. El hero del
documento tiene además degradado, radio de panel, texto acotado al 62 % del ancho
y la pose sangrando por la esquina inferior derecha — nada de lo cual cabe en una
prop de escala de `PageHeader`, y todo lo cual son reglas de identidad que si no
viven aquí se reimplementan cinco veces. Son dos piezas distintas: `PageHeader`
sigue siendo la cabecera de sección y va dentro de `<main>`; `Hero` es la portada
y va uno por sitio.

**`NewsletterForm`.** Se había descartado porque «la mitad de su código es un
`POST` a un endpoint que solo vive ahí: eso es infraestructura». Correcto, y por
eso el `POST` no está aquí. El componente es presentacional: recibe `state` y
emite `onSubmitEmail`, y el proyecto hace la llamada con su proveedor. Lo que sí
es identidad son los cuatro estados y, sobre todo, que el aviso vaya **debajo**
del formulario en vez de reemplazarlo — reemplazarlo es lo que rompe el caso real
de quien se suscribe con el correo equivocado.

`Nav`, `Footer`, `Breadcrumb` y `Hero` son composición de página y se pueden
discutir como piezas de librería. Entran igual: la estética CLI —el `./sección`
de la barra, el `~ / artículos / slug` de la ruta, la firma `$ cd ~/…` del pie—
es lo primero que se desincroniza cuando cinco proyectos la escriben cada uno por
su cuenta.

### Decisiones de la Fase 3

- **Sin `lucide-react`.** Los ocho glifos que los primitivos necesitan están
  inline en `src/lib/glyphs.tsx`, heredan `currentColor` y miden 1em. Una
  librería de iconos como dependencia se la come cada uno de los cinco proyectos.
- **Sin animaciones de entrada.** Modales, menús, tooltips y toasts aparecen
  donde van a quedarse. La perilla del `Switch` cambia de posición sin deslizarse.
  La única transición del sistema es `transition-standard`, que solo puede animar
  color y borde porque así está escrita la utilidad.
- **Una excepción, documentada:** el spinner de `Button loading` gira. Un botón
  cargando sin movimiento es indistinguible de uno deshabilitado; es
  realimentación de progreso, no de estado, y va envuelto en `motion-safe`.
- **`Progress` exige `label`.** Una barra sin nombre accesible no dice de qué es
  el progreso, y ninguna otra parte del componente puede deducirlo.
- **Cero hex literales**, incluido `Button`. La regla 2 sale con
  `light:bg-brand-hull`, porque el casco ya era un token.
- **`cursor-pointer` explícito** en todo lo que se pulsa. Tailwind v4 quitó del
  preflight el `cursor: pointer` de `button`, así que un botón sin la clase se
  queda con la flecha del sistema. Lo llevan `Button`, `Checkbox`,
  `RadioGroupItem`, `Switch`, `TabsTrigger`, el disparador de `Select`, los
  cerrar de `Dialog`/`Sheet`/`Toast`, `PaginationLink`, el casco de las tarjetas
  pulsables y los enlaces de `Nav`, `Footer` y `Breadcrumb` — que renderizan
  `<a>` sin `href` cuando se les enchufa el `Link` de un enrutador.

  Dos excepciones deliberadas. `Label` apunta a un control pero no es el control.
  Y los **ítems de menú** de `Select` y `DropdownMenu` se quedan en
  `cursor-default`: un menú nativo no muestra la manito, y el highlight de la
  fila ya dice que la fila responde.

### La paleta de sintaxis

Del documento, literal: «keywords arena, strings bioluz, comments plancton,
identifiers espuma», sobre casco. Cuatro colores a propósito — funciones,
variables y tipos caen los tres en espuma, porque el sistema se comunica con
color y borde y no con ruido cromático. Los números y booleanos van con las
cadenas: el documento no los asigna, y agruparlos por «son literales» es más
coherente que estrenar un quinto color.

Medido sobre `brand.hull` #0B1524, todo AA:

| rol | token | contraste |
| --- | --- | --- |
| identificador | `textPrimary` | 16.42:1 |
| literal | `accent` | 10.05:1 |
| palabra clave | `warm` | 9.05:1 |
| comentario | `textMuted` | 5.43:1 |
| invalidez | `error` | 4.97:1 |

`brand.body` (#3E7CB1) no entra: el sistema lo restringe a relleno y aquí mide
4.2:1.

Vivía escrita a mano en `eduardoalvarez.dev/src/settings/shiki-reef.ts`, y ahí
dentro se había quedado un `#E05252` — justo el hex que este README dice que está
mal. Es el caso de libro de por qué la paleta no puede vivir dentro de un
proyecto: el tema se genera desde `tokens.sintaxis` y el rojo sale corregido solo.

### Temas anidables

`theme.css` emite un bloque por modo, no solo el claro. Así un subárbol puede
declarar el modo contrario al de la página y todo lo de dentro lo respeta.

Lo usa `CodeBlock`: `brand.hull` es «fondo de bloques de código», así que un
bloque es oscuro también en modo claro — y ahí `textPrimary` es casi negro. La
raíz del bloque declara `data-theme="dark"` y la tinta se resuelve sola. Es la
única isla de tema invertido del sistema, y es deliberada.

### Las tarjetas y la regla 6

`ArticleCard`, `TalkCard`, `CourseCard` y `LinkRow` comparten un casco interno
que no se publica, para que la regla 6 viva en un solo sitio: el hover cambia el
borde de `hairline` a `hairlineHover` y tiñe el título de acento. Nada más.

`LinkRow` viene de `links/src/components/Card.astro`, que escalaba la tarjeta al
102 %, subía el título un píxel y giraba y agrandaba el icono — cuatro
movimientos que el sistema no permite.

Ninguna tarjeta depende de un enrutador: por defecto renderizan un `<a href>`, y
`asChild` deja enchufar el `Link` de Next o de Astro.

### `AudioPlayer` — qué cambió al migrarlo

La lógica no se reescribió. Los tres modos, el reproductor flotante, los saltos
de ±15s, el ciclo de velocidad 1 → 1.25 → 1.5 → 1.75 → 2 y el volumen con mute
son los del portafolio. Lo que cambió:

**Dos dependencias que un paquete no puede tener.** `Icon` del portafolio pasó a
`src/lib/glyphs.tsx` con los trazados idénticos; `trackEvent` pasó a la prop
`onFirstPlay`, que sigue disparándose una sola vez por carga.

**Un cambio de API.** `compact`/`banner` como dos booleanos pasaron a
`mode="full" | "compact" | "banner"`, que es el vocabulario con el que ya se
describían los tres modos. Hay que tocar las llamadas del portafolio en la Fase 6.

**Tres animaciones que el sistema no permite.** La onda ya no anima `scaleY` — las
barras siguen distinguiendo reproducción de pausa por opacidad. El flotante
aparece y desaparece en vez de deslizarse. La barra de progreso ya no interpola
el ancho, que además la hacía ir por detrás del audio. El giro del spinner de
carga se queda, con la misma justificación que en `Button`.

**Un fallo de contraste heredado.** El botón de velocidad ponía `textMuted` sobre
`surfaceRaised`: 4.07:1 en oscuro. Pasó a `textSecondary`. El original arrastra
ese fallo.

**Un `bug` latente.** Las piezas del reproductor viven a nivel de módulo, no
dentro del componente. Declaradas dentro, cambian de identidad en cada render y
React las remonta: con `timeupdate` disparando cuatro veces por segundo, el
arrastre de la barra perdía el pointer capture.

### La marca

Las trece piezas de Tiburoncín estaban repartidas por los cinco proyectos, byte
a byte idénticas. Se consolidaron en `assets/brand/` y se publican en el
paquete; se sirven en `/brand`, que es la misma ruta que todos usan ya desde su
`public/`, así que el valor por defecto de `basePath` funciona sin configurar
nada.

```tsx
import { Logo, Mascota, CaraDeMascota, listaCaras } from '@eduardoalvarez/arrecife/brand';
```

| | |
| --- | --- |
| aletas | `fin.png` (dos azules) y `fin-foam.png` (silueta espuma) |
| caras | annoyed · confused · hearts · laughing · shades · waiting · wink |
| poses | desk · laptop-coffee · peek · surf |

Los nombres son un tipo: una cara que no existe no compila, y el autocompletado
ofrece las que hay. Añadir una es soltar el PNG y añadir una línea al catálogo.

**Regla 1 como API.** `sobre="oscuro"` usa la silueta a una tinta y
`sobre="claro"` la de dos azules. No es una nota en una guía: es una prop. El
análisis de píxeles lo confirma — el 94 % de `fin-foam.png` es `#EDF4F3`, o sea
el token espuma.

**Regla 5 como API.** El wordmark sale de `naming.wordmark` y siempre dice
«Eduardo Álvarez». No hay ninguna prop que permita cambiar ese texto, y
Tiburoncín no aparece escrito dentro del logo.

**Regla 4 como API.** Las caras van solo en estados vacíos, confirmaciones,
errores, progreso de curso y celebración. La regla vive en qué componentes
aceptan una cara, no en la documentación.

El formato es un detalle de implementación: cuando lleguen los SVG, se
reemplazan los archivos y no cambia una línea de código.

### Los ocho que se añadieron después

No estaban en la lista original. Entraron midiendo en cuántos de los cinco
proyectos se usa cada uno, con el mismo criterio que sacó a `Hero` y
`NewsletterSection`.

| | archivos que lo usan | por qué |
| --- | --- | --- |
| `Card` | 34, en 4 proyectos | Es la única definición de qué es una superficie de tarjeta. Las cuatro tarjetas con dominio reutilizan sus clases. |
| `Label` | 21, en 2 | Había siete controles de formulario y ninguna etiqueta. |
| `Avatar` | 19, en 3 | Uno solo para todo: no hay un `brand/Avatar` aparte, porque una foto de perfil es esto con otro `src`. |
| `Sheet` | 6, en 3 | Es `Dialog` con variante de lado. |
| `Separator` | 8, en 2 | `hairline` era un token sin componente. |
| `Popover` | 5, en 3 | Base de cualquier selector desplegable. |
| `DateField` | — | El control nativo, sin dependencias, para elegir fecha en un formulario. |
| `Calendar` | 6, en 3 | Calendario mensual navegable, para el planificador de contenido. `fullWidth` lo estira al ancho del contenedor. |

No hay `DatePicker`: son `Popover` más `Calendar` y son cinco líneas. Un tercer
componente que solo pega dos que ya existen es superficie de API que mantener sin
ganar nada.

`Popover` exige `aria-label` o `aria-labelledby` en el tipo. Radix le pone
`role="dialog"` al contenido, y un diálogo sin nombre accesible no le dice nada a
un lector de pantalla: ahora no se puede olvidar porque no compila.

### La segunda excepción de movimiento

`Sheet` se desliza. Es la segunda y última excepción a «nada de desplazamiento»,
aprobada a sabiendas: un panel que entra desde un borde quieto sería un modal
descentrado. Dura `--duration-standard` con `--ease-standard` —lo mismo y con la
misma curva que cualquier cambio de color— así que no introduce un tiempo nuevo,
y va detrás de `motion-safe`.

`Calendar` **no** anima el cambio de mes: `animate` de react-day-picker se queda
en su valor por defecto, que es apagado.

### `Text` — la escala como API

`Text` no estaba en la lista original y se añadió después, porque sin él la
escala solo existía como clases sueltas y nada impedía poner `text-display` en un
párrafo. Tres reglas del sistema viven dentro del componente:

| regla | cómo se aplica |
| --- | --- |
| display solo para titulares, nunca cuerpo | la familia va atada a la escala; no existe una prop `font` |
| el peso y el tracking son de la escala | vienen del token `--text-*` y no se exponen |
| medida máxima de cuerpo 68ch | `body` la aplica solo; `measure={false}` la quita |

`as` y `variant` son independientes a propósito: un encabezado de segundo nivel
que tiene que verse más pequeño es `<Text as="h2" variant="h3">`, no un `h3` que
miente sobre la jerarquía de la página.
