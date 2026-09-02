# Migrating to 0.6.0 — the library speaks English

Everything in this release is one change: **the code moved from Spanish to
English**. Identifiers, types, prop names, prop values, CSS utilities, subpaths,
comments and documentation.

Nothing about how anything looks or behaves changed. Not one hex, not one
measurement, not one contrast ratio moved. If a component looks different after
migrating, it is a bug — open an issue.

## Why

The library was written in Spanish by convention, and the convention stopped
paying for itself. Two facts settled it:

1. **The ecosystem the library sits on is in English.** Radix, Tailwind, React
   Hook Form and Recharts all are, and half of every file was already a mix:
   `variant`, `asChild` and `onSubmitEmail` next to `plantillaArticulo` and
   `usoDeCara`. A file with two vocabularies makes you decide which one applies
   at every new symbol, and that decision was being made differently each time.
2. **Agents read this code.** `llms.txt` travels in the package and is the
   document an agent reads from a consuming project. A bilingual API is a
   bilingual document.

The whole repo moved at once. A repo half in each language is worse than either.

**User-facing copy stays in Spanish.** All five consuming sites are in Spanish,
so the taglines in `tokens.ts`, the default labels of `NewsletterForm` and
`AvatarUpload` and the demo content in the stories are untouched. What moved is
what a developer writes, not what a reader reads.

## The subpath that changed

```diff
- import { scriptTema } from '@eduardoalvarez/arrecife/tema';
+ import { themeScript } from '@eduardoalvarez/arrecife/theme';
```

`./tema` is now `./theme`. The other seven subpaths keep their names.

## Renames, by area

### `./theme`

| Before | Now |
| --- | --- |
| `scriptTema` | `themeScript` |
| `aplicarTema` | `applyTheme` |
| `alternarTema` | `toggleTheme` |
| `temaActual` | `currentTheme` |
| `temaGuardado` | `storedTheme` |
| `temaPreferido` | `preferredTheme` |
| `escucharTema` | `watchTheme` |
| `useTema` | `useTheme` |
| `Tema` (type) | `Theme` |
| `TEMA_CLAVE` | `THEME_KEY` |
| `TEMA_ATRIBUTO` | `THEME_ATTRIBUTE` |
| `TEMA_EVENTO` | `THEME_EVENT` |

**The stored values changed too**, and this one has a visible effect:
`localStorage` moved from `arrecife-tema` to `arrecife-theme`, and the custom
event from `arrecife:tema` to `arrecife:theme`. Anyone who had already chosen a
theme loses that choice exactly once, and falls back to the system preference on
their next visit. There is no migration for this and it is not worth writing one:
it is one click, once.

If a project reads the key directly — the blog's `public/theme.js` did — that is
the line to update.

### `./tokens`

| Before | Now |
| --- | --- |
| `sintaxis` | `syntax` |
| `sintaxis.fondo` | `syntax.background` |
| `sintaxis.identificador` | `syntax.identifier` |
| `sintaxis.palabraClave` | `syntax.keyword` |
| `sintaxis.comentario` | `syntax.comment` |
| `sintaxis.invalido` | `syntax.invalid` |
| `SintaxisToken` (type) | `SyntaxToken` |
| `gradient[mode].seccion` | `gradient[mode].section` |
| `tagline.largo` / `tagline.corto` | `tagline.long` / `tagline.short` |

`syntax.literal` keeps its name.

### `./brand`

| Before | Now |
| --- | --- |
| `Mascota` / `MascotaProps` | `Mascot` / `MascotProps` |
| `CaraDeMascota` / `CaraDeMascotaProps` | `MascotFace` / `MascotFaceProps` |
| `Isotipo` / `IsotipoProps` | `Isotype` / `IsotypeProps` |
| `caras` | `faces` |
| `listaCaras` | `faceList` |
| `listaPoses` | `poseList` |
| `usoDeCara` | `faceUsage` |
| `aletas` | `fins` |
| `aletas.espuma` | `fins.foam` |
| `Cara` (type) | `Face` |
| `Aleta` (type) | `Fin` |
| `RUTA_ASSETS` | `ASSETS_PATH` |

`Pose` and `poses` were already English and are unchanged.

### `./og`

| Before | Now |
| --- | --- |
| `plantillaArticulo` | `articleTemplate` |
| `plantillaCharla` | `talkTemplate` |
| `plantillaCurso` | `courseTemplate` |
| `plantillaDefecto` | `defaultTemplate` |
| `NodoSatori` (type) | `SatoriNode` |
| `DatosArticulo` / `DatosCharla` / `DatosCurso` / `DatosBase` | `ArticleData` / `TalkData` / `CourseData` / `BaseData` |
| `OG.margen` | `OG.margin` |
| `OG.mascota` | `OG.mascot` |
| `OG.aletaFirma` | `OG.signatureFin` |
| `OG.reservaMascota` | `OG.mascotReserve` |

### `./chart`

| Before | Now |
| --- | --- |
| `colorDeSerie` | `seriesColor` |
| `COLORES_DE_SERIE` | `SERIES_COLORS` |

### Components and primitives

| Before | Now |
| --- | --- |
| `Red` (type, `Footer`) | `SocialLink` |
| `EventoCalendario` (type) | `CalendarEvent` |
| `TARJETA` / `SUPERFICIE_TARJETA` / `HOVER_TARJETA` | `CARD` / `CARD_SURFACE` / `CARD_HOVER` |
| `social.Correo` | `social.Email` |
| `TableOfContents`'s `Input` type | `TocEntry` |

### Prop names and values

This is the part a compiler will not always catch, because several of them are
string literals.

| Component | Before | Now |
| --- | --- | --- |
| `Hero` | `variant="cabecera" \| "centrado"` | `variant="header" \| "centered"` |
| `Alert` | `enfasis="sutil" \| "fuerte"` | `emphasis="subtle" \| "strong"` |
| `NewsletterForm` | `state="reposo" \| "exito"` | `state="idle" \| "success"` |
| `Isotype`, `Logo` | `sobre="oscuro" \| "claro"` | `background="dark" \| "light"` |
| `Logo` | `soloIsotipo` | `isotypeOnly` |
| `Logo` | `conLema` | `withTagline` |
| `MascotFace` | `expresion` | `expression` |

`NewsletterForm`'s `state="sending"` and `state="error"` were already English.

### CSS utilities

If your project writes any of these classes by hand — `links` does — they change:

| Before | Now |
| --- | --- |
| `degradado-hero` | `gradient-hero` |
| `degradado-seccion` | `gradient-section` |
| `desplegar` / `replegar` | `expand` / `collapse` |
| `deslizar-entra-derecha` | `slide-in-right` |
| `deslizar-sale-derecha` | `slide-out-right` |
| `deslizar-entra-izquierda` | `slide-in-left` |
| `deslizar-sale-izquierda` | `slide-out-left` |
| `deslizar-entra-arriba` | `slide-in-top` |
| `deslizar-sale-arriba` | `slide-out-top` |
| `deslizar-entra-abajo` | `slide-in-bottom` |
| `deslizar-sale-abajo` | `slide-out-bottom` |

And one custom property that projects do read:

| Before | Now |
| --- | --- |
| `--color-serie-1` … `--color-serie-4` | `--color-series-1` … `--color-series-4` |
| `--gradient-seccion` | `--gradient-section` |

The Tailwind utility for the series follows: `bg-serie-1` becomes
`bg-series-1`.

## How to migrate

Most of it is mechanical and the compiler finds it. The order that works:

1. **Bump the version and run the type checker.** Every renamed identifier and
   type shows up as an error with the file and the line. That covers the tables
   above except the string literals.
2. **Grep for the string literals**, which types will not always catch:

   ```bash
   grep -rn "cabecera\|centrado\|sutil\|fuerte\|reposo\|exito\|oscuro\|claro" src/
   ```

   Not every hit is ours — `claro` and `oscuro` are ordinary Spanish words in
   content — so read them rather than replacing blind.
3. **Grep for the CSS utilities**, which no compiler sees at all:

   ```bash
   grep -rn "degradado-\|deslizar-\|serie-[0-9]\|--gradient-seccion" src/
   ```
4. **Check the `localStorage` key** if the project reads or writes the theme
   outside the library.

There is no codemod. The renames are not one-to-one at the token level —
`sobre` becomes `background` in one place and disappears in another — and a
blind script would rewrite Spanish content as well as code. The four steps above
took under an hour on the largest consumer.

## What did not change

- Every color, size, radius, spacing step and contrast ratio.
- The rendered markup of every component.
- `variant`, `tone`, `size`, `asChild`, `className` and every prop that was
  already in English.
- The seven subpaths that are not `./tema`.
- Spanish user-facing copy: taglines, default labels, demo content.
