# Arrecife

Librería de componentes de la identidad visual de Eduardo Álvarez.
`@eduardoalvarez/arrecife` · React 19 · TypeScript · shadcn/ui · Storybook · tsup.

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
| `variant` | `display · h1 · h2 · h3 · body · ui · label · eyebrow` | `body` |
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
| `pnpm test` | corre axe sobre las 125 stories, en los dos modos |
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

## Estado

- **Fase 1** · andamiaje, tokens y Storybook con el switch de tema. Completa.
- **Fase 2** · `brand/`. Esperando los SVG del ilustrador.
- **Fase 3** · los 18 primitivos sobre shadcn/Radix, más `Text` y ocho añadidos
  después de medir el uso real en los cinco proyectos. Completa.
- **Fase 4** · `AudioPlayer`, migrado. Completa.
- **Fase 5** · en curso. Hechos `ArticleCard`, `TalkCard`, `CourseCard`, `LinkRow`,
  `CodeBlock`, `Blockquote` y `PageHeader`. Faltan `EmptyState`, `NavBar`,
  `Footer` y `og/`, que dependen de `brand/` y esperan los SVG.

  `Hero` y `NewsletterSection` salieron de la lista. El hero del portafolio y el
  de cursos son el mismo esqueleto que una cabecera de sección — eyebrow en
  acento, titular, párrafo acotado — así que `PageHeader` los cubre con una prop
  de escala en vez de duplicar la regla. Y la captura de correo existe en un solo
  proyecto y la mitad de su código es un `POST` a un endpoint que solo vive ahí:
  eso es infraestructura, no identidad.

  El criterio para decidir qué entra: **codifica una regla de identidad, tiene dos
  o más consumidores, y no arrastra infraestructura del proyecto.**

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
