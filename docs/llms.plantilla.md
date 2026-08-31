# @eduardoalvarez/arrecife

> GENERADO por `scripts/build-llms.mjs`. No lo edites a mano: la prosa está en
> `docs/llms.plantilla.md` y el inventario sale de los tipos en cada build.
> `pnpm check:llms` falla si este archivo y el código dejan de decir lo mismo.

Librería de componentes de la identidad visual de Eduardo Álvarez. React 19,
TypeScript, Tailwind v4, shadcn/ui sobre Radix.

Este documento es para un agente que escribe código en un proyecto que consume la
librería. Si estás trabajando **dentro** del repo de Arrecife, el documento es
`AGENTS.md`, no este.

## Lo primero: no reimplementes lo que ya está aquí

Antes de escribir una tarjeta, un botón, una cabecera o un pie, busca en el
inventario de más abajo. La librería existe porque cinco proyectos escribían las
mismas piezas cada uno por su cuenta y se desincronizaban. Un componente nuevo
escrito a mano en el proyecto consumidor reintroduce exactamente ese problema.

Tampoco escribas colores, tamaños ni espaciados a mano. Todo valor del sistema
tiene un token y una utilidad de Tailwind; un `#hex` o un `p-[13px]` en el
proyecto consumidor es la señal de que se eligió el camino equivocado.

## Instalación

```bash
pnpm add @eduardoalvarez/arrecife
```

Requisitos, y no son opcionales:

| | |
| --- | --- |
| React | `^19.0.0` y `react-dom` `^19.0.0`, como peer dependencies |
| Tailwind | v4. **No hay preset de v3**: la salida es `@theme`, que v3 no entiende |
| Node | `>=22.18.0` para las subrutas que corren en build (`./og`, `./tokens`) |

Radix, `clsx`, `tailwind-merge`, `class-variance-authority`, `date-fns` y
`react-day-picker` vienen como dependencias de la librería. No hace falta
instalarlos ni declararlos.

**No lleva `lucide-react` ni ninguna librería de iconos.** Los glifos que los
componentes necesitan van inline, heredan `currentColor` y miden 1em.

## Configuración de Tailwind

Dos líneas, en este orden, en la hoja de estilos de entrada del proyecto:

```css
@import "tailwindcss";
@import "@eduardoalvarez/arrecife/tokens/theme.css";
```

Sin la segunda, los componentes se montan sin ningún estilo del sistema: las
clases que usan (`bg-surface-raised`, `text-h1`, `rounded-card`) no existen en un
Tailwind pelado.

Tailwind tiene que escanear la librería para no purgar esas clases. Si el
proyecto declara `@source`, incluye el paquete:

```css
@source "../node_modules/@eduardoalvarez/arrecife/dist";
```

### Modo claro y modo oscuro

**El modo oscuro es el primario y es el default.** Un proyecto oscuro no declara
nada. Un proyecto en modo claro declara el atributo en `<html>`:

```html
<html data-theme="light">
```

No hay clase `dark:`. La variante disponible es `light:`, para los casos del modo
claro invertido, y casi nunca hace falta: los tokens ya cambian solos.

### Fuentes

La librería declara las familias **por nombre** y no las carga. El proyecto carga
Bricolage Grotesque (`font-display`), Geist (`font-sans`) y JetBrains Mono
(`font-mono`) como prefiera —`next/font`, `@fontsource`, un `<link>`—. Si no las
carga, el navegador cae al fallback y la tipografía se ve mal.

El nombre tiene que coincidir **exactamente** con el que declaran los tokens, y
esto ya ha fallado en dos proyectos:

| Utilidad | Nombre que pide el token |
| --- | --- |
| `font-display` | `"Bricolage Grotesque"` |
| `font-sans` | `"Geist"` |
| `font-mono` | `"JetBrains Mono"` |

Varios paquetes de fuentes las publican como `"Bricolage Grotesque Variable"` o
`"Geist Variable"`. Registrar el `@font-face` con ese nombre NO carga lo que los
tokens piden: la familia cae al sistema en silencio, sin error en consola. El
`font-family` del `@font-face` es un alias que elige el proyecto, así que se
escribe con el nombre de la tabla.

## Qué importar de dónde

`exports` tiene cinco subrutas y la elección importa: tres de ellas **no
arrastran React**, y por eso pueden consumirse desde un worker, un
`astro.config.mjs`, un script de build o un generador con Satori.

| Subruta | Arrastra React | Para qué |
| --- | --- | --- |
| `@eduardoalvarez/arrecife` | sí | Componentes, primitivos, marca, `cn`. Reexporta tokens |
| `@eduardoalvarez/arrecife/tokens` | **no** | El objeto `tokens` en JS. Satori, Astro, scripts |
| `@eduardoalvarez/arrecife/tokens/theme.css` | — | El `@theme` de Tailwind v4 |
| `@eduardoalvarez/arrecife/og` | **no** | Las plantillas de Open Graph para Satori |
| `@eduardoalvarez/arrecife/shiki` | **no** | El tema de resaltado de sintaxis |
| `@eduardoalvarez/arrecife/brand` | sí | Logo, isotipo y mascota como componentes |
| `@eduardoalvarez/arrecife/assets/*` | — | Los PNG de la marca |

Importar la raíz desde un script de build para sacar un token es el error que las
subrutas existen para evitar: arrastra React entero a un worker que no lo monta.

```ts
// Bien, en un generador de OG o en astro.config.mjs
import { tokens } from '@eduardoalvarez/arrecife/tokens';
import { arrecife } from '@eduardoalvarez/arrecife/shiki';

// Mal: monta React donde no hace falta
import { tokens } from '@eduardoalvarez/arrecife';
```

## Tokens

La fuente es un objeto de TypeScript y la salida CSS se genera de él, así que el
mismo valor está disponible en los dos sitios y no pueden discrepar.

| Token | Custom property | Utilidad de Tailwind |
| --- | --- | --- |
| `colors[modo].surfaceRaised` | `--color-surface-raised` | `bg-surface-raised` |
| `brand.hull` | `--color-brand-hull` | `bg-brand-hull` |
| `typeScale.h1` | `--text-h1` | `text-h1` (arrastra line-height, weight y tracking) |
| `fonts.display` | `--font-display` | `font-display` |
| `radius.card` | `--radius-card` | `rounded-card` |
| `spacing.stepLg` | `--spacing-step-lg` | `p-step-lg`, `gap-step-lg`, `mb-step-lg` |
| `spacing.section` | `--spacing-section` | `py-section`, `mb-section` |
| `control.md` | `--spacing-control-md` | `px-control-md` |
| `control.icon` | `--spacing-control-icon` | `size-control-icon` (42×42) |
| `gradient[modo].hero` | `--gradient-hero` | `degradado-hero` |
| `size.nav` | `--spacing-nav` | `h-nav` |
| `size.content` / `size.wide` | `--container-content` / `--container-wide` | `max-w-content` / `max-w-wide` |
| `limits.measure` | `--container-measure` | `max-w-measure` |
| `shadow.standard` | `--shadow-standard` | `shadow-standard` |
| `motion` | `--duration-standard`, `--ease-standard` | `duration-standard`, `ease-standard` |

`transition-standard` es la única transición del sistema y solo puede animar
color y borde: así está escrita la utilidad.

**Los escalones de espaciado llevan `step` en el nombre y no es opcional.**
`p-md` no es una clase de Arrecife: en un proyecto con Tailwind v4 cae en la
escala numérica y no hace nada visible. El ritmo de página es `p-step-md`,
`gap-step-sm`, `py-step-xl`. Llevan prefijo porque `xs, sm, md, lg, xl` son los
nombres de la escala `--container-*` de Tailwind, y un `--spacing-md` propio se
comía `max-w-md` en todo el proyecto sin avisar de nada. `max-w-*`, `w-*` y `h-*`
son de Tailwind y se usan tal cual. Guía de migración desde la 0.2.0:
<https://github.com/Proskynete/arrecife/blob/main/docs/migracion-0.3.md>.

## Reglas del sistema que el código consumidor no debe romper

Son decisiones de identidad, ya medidas. Romperlas produce código que compila y
se ve mal, o que falla la auditoría de accesibilidad del proyecto.

1. **Cero hex literales.** Todo color sale de un token o de su custom property.
2. **`Button variant="conversion"` va una sola vez por pantalla.** No se fuerza en
   runtime; dos en la misma página son un error de diseño.
3. **No hay variante de peligro en `Button`.** El error del sistema vive en los
   avisos y en la validación de campo, no en un botón rojo.
4. **`secondary` nunca se rellena el fondo.** Es borde y texto.
5. **Sin animaciones de entrada.** Modales, menús, tooltips y toasts aparecen
   donde van a quedarse. La única excepción es el spinner de `Button loading`.
6. **La semántica y la escala son independientes.** Un `h2` que debe verse
   pequeño es `<Text as="h2" variant="h3">`, nunca un `h3` que miente sobre la
   jerarquía.
7. **`textMuted` no va nunca sobre `surfaceRaised`**: da 4.07 en oscuro. Sobre
   superficie elevada —menús, tabs activos— el token es `textSecondary`.
8. **Un fondo teñido con un color semántico lleva texto de token de texto**, no
   del color semántico. El color se queda en el borde y en el glifo. Poner
   `accent` sobre su propio tinte al 8 % da 4.12 y no llega a AA.
9. **`Progress` exige `label`.** Una barra sin nombre accesible no dice de qué es.
10. **`Button size="icon"` exige `aria-label`.** No lleva texto.
11. **Las caras de la mascota solo aparecen** en estados vacíos, confirmaciones,
    errores, progreso de curso y celebración. Nunca en hero, precios, servicios,
    contacto ni CV.
12. **La aleta no es un parámetro libre**: `espuma` sobre fondo oscuro, `color`
    sobre fondo claro. Los componentes ya la eligen por el fondo.

## Lo que la librería NO hace, a propósito

Estas son las confusiones que más veces se cometen al consumirla.

- **No trae Shiki.** Publica el *tema*, no el resaltador. `CodeBlock` recibe el
  código **ya resaltado** por la herramienta del proyecto.
- **No formatea fechas.** `ArticleCard`, `TalkCard` y compañía reciben la fecha ya
  formateada por el proyecto: la librería no impone locale. `dateTime` es aparte,
  en ISO, para el atributo del `<time>`.
- **`NewsletterForm` no hace el POST.** Es presentacional: recibe `state` y emite
  `onSubmitEmail`. La llamada la hace el proyecto con su proveedor.
- **No trae enrutador.** Los componentes con enlaces aceptan `asChild` para
  envolver el `Link` del framework.
- **No carga fuentes.** Las declara por nombre.
- **No hay preset de Tailwind v3.**

## Patrones de uso

```tsx
import { Text, Button, Badge, cn } from '@eduardoalvarez/arrecife';
import type { TextProps } from '@eduardoalvarez/arrecife';

<Text variant="eyebrow" tone="muted">charlas</Text>
<Text as="h2" variant="h1">Escalar con criterio</Text>
<Text variant="body">Se corta solo a 68ch.</Text>
<Text variant="ui" measure={false}>Sin corte, para una celda estrecha.</Text>
```

`asChild` renderiza el hijo en vez del elemento propio. Es como se envuelve el
enlace del framework sin perder los estilos:

```tsx
<Button asChild>
  <Link href="/cursos">Ver los cursos</Link>
</Button>
```

`cn` es `clsx` + `tailwind-merge`. Se usa para componer `className` sin que dos
utilidades del mismo grupo peleen.

Open Graph, sin React:

```ts
import satori from 'satori';
import { plantillaArticulo, OG } from '@eduardoalvarez/arrecife/og';

const svg = await satori(plantillaArticulo({ title, date, readingMinutes }), {
  width: OG.width,   // 1200
  height: OG.height, // 630
  fonts: [...],
});
```

Resaltado de sintaxis, desde la configuración del sitio:

```ts
import { arrecife } from '@eduardoalvarez/arrecife/shiki';

export default defineConfig({
  markdown: { syntaxHighlight: 'shiki', shikiConfig: { theme: arrecife } },
});
```

# Inventario

Lo que sigue sale del compilador de TypeScript en cada build. Solo se listan los
props **declarados por la librería**: los heredados de un elemento HTML o de una
primitiva de Radix se resumen en la línea `Extiende`, y son los de siempre.

<!-- INVENTARIO -->

# Dónde mirar si esto no basta

- Storybook publica cada componente con sus stories y la tabla de props generada
  desde los tipos.
- `README.md` del repo: el porqué de cada decisión, la tabla de correcciones de
  contraste y el ciclo de publicación.
- `docs/design-system.md` y `docs/manual-de-marca.md`: los documentos de
  identidad, consultables con `grep`.
- `docs/decisiones.md`: los quince puntos donde el código y el documento no
  decían lo mismo, con la resolución de cada uno.
- `AGENTS.md`: para trabajar dentro del repo de la librería.
