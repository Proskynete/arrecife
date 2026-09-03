# Migrating to 0.6.0

Two things landed in this version, and they are unrelated: the whole API moved
from Spanish to English, and the thirteen points of the consuming projects'
backlog were implemented. They ship together because in `0.x` a breaking change
bumps the minor, so two `feat!` batches merged before the release is cut are one
version and not two.

**Do the rename first.** The second half assumes the English names.

---

## Part one · the library speaks English

The code moved from Spanish to English: identifiers, types, prop names, prop
values, CSS utilities, subpaths, comments and documentation.

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

---

## Part two · the API changes

### The four breaking changes

#### 1 · `themeScript` is a function

```diff
- <script is:inline set:html={themeScript} />
+ <script is:inline set:html={themeScript()} />
```

TypeScript catches this in both consumers: `set:html` and `__html` both expect a
string, and a function is not one. It cannot fail silently.

While you are there, this is the reason the prop exists:

```astro
<!-- This site IS dark. The OS is not consulted. -->
<script is:inline set:html={themeScript({ base: 'dark' })} />
```

All five of these projects are dark by decision, and until now the library gave
them no way to say so — which is why they kept their own `public/theme.js`. A
stored choice still wins over `base`, so the toggle keeps working: it sets what
happens when nobody has chosen yet.

`preferredTheme` and `watchTheme` take the same option. If you pass `base` to the
script, pass it to those too, or you get the OS sneaking back in through the
other two doors.

#### 2 · The root ships `"use client"`

Nothing to add. Something to **remove**.

If your Next project wrapped the library in adapters of its own marked
`"use client"` — `components/ui/button.tsx`, `components/ui/badge.tsx` — those
are what the missing directive forced. They still work, and they keep costing:
in `cursos` they were 272 KB of client chunk, paid even by a `Badge` that is a
`<span>` with no interaction.

```diff
- // components/ui/badge.tsx
- 'use client';
- export { Badge } from '@eduardoalvarez/arrecife';
```

Import from the library directly. A Server Component can do it now.

And if what you actually wanted were the classes and not the component, that is
what `./variants` is for — it carries no directive, so nothing crosses to the
client:

```tsx
import { buttonVariants, CARD_SURFACE } from '@eduardoalvarez/arrecife/variants';

<a className={buttonVariants({ variant: 'tertiary' })} href="/cursos">./ver_cursos →</a>
```

**In Astro and in plain Vite nothing changes.** The directive is a string literal
at the top of a module; Rollup may warn `Module level directives cause errors
when bundled` and that is the whole of it.

#### 3 · `TalkCardProps` is a union

A `TalkCard` with `resources` is not a link, because an `<a>` inside an `<a>` is
invalid HTML. The type says so:

```tsx
// Compiles: the card is the link.
<TalkCard href="/charlas/escalar" title="…" event="JSConf" />

// Compiles: the resources are the links.
<TalkCard title="…" event="JSConf" resources={<><a href="#slides">./slides</a></>} />

// Does not compile, and should not.
<TalkCard href="/charlas/escalar" resources={…} />
```

Only code that spreads a props object typed as `TalkCardProps` and then adds
`href` conditionally needs narrowing. Every call site that passes `href` and
nothing else is unchanged.

#### 4 · `Stat`'s `tone="alerta"` is `tone="alert"`

```diff
- <Stat value="0" label="design systems" tone="alerta" />
+ <Stat value="0" label="design systems" tone="alert" />
```

The last public API value still in Spanish, and the only one `llms.txt` was
publishing — which meant an agent reading the document from a consuming project
wrote Spanish into a library that had decided it would not have any.

Nothing else moves: same colour, same rule, same `neutral` default. `tsc` points
at every call site, and there is nowhere for it to hide, because `tone` is not a
string a project computes.

While you are there, there is now a **third** value and it breaks nothing:
`tone="achievement"`, for the number that is the opposite of a problem — the
diplomas issued, the modules finished. It paints the same sand as `alert` on
purpose; see [`decisions.md`](decisions.md) § 28.

---

### What you can delete

This release exists to remove things from the projects, not to add them. Per
project:

| Project | What comes out |
| --- | --- |
| `cursos` | The `"use client"` adapters around `Button` and `Badge`, and the 272 KB with them |
| `links` | The copied class vocabulary in `LinkRow.astro` and `Footer.astro`, and `scripts/check-replica-drift.mjs` with it |
| `eduardoalvarez.dev` | `public/theme.js`, the hand-drawn bell, and the four `NewsletterForm` workarounds |
| `blog-content-manager` | `src/components/ui/brand-icons.tsx`, the `"use client"` wrapper around two `<svg>` |

The four workarounds, specifically:

```diff
- // The pose, positioned absolutely with room reserved by hand
- <div className="relative md:pr-[330px]">
-   <NewsletterForm … />
-   <Mascot pose="desk" className="absolute right-0 …" />
- </div>
+ <NewsletterForm … aside={<Mascot pose="desk" />} />

- // Finding the form with a ref to reset it
- const box = useRef<HTMLDivElement>(null);
- useEffect(() => { if (ok) box.current?.querySelector('form')?.reset(); }, [ok]);
+ // resetOnSuccess is on by default. Nothing to write.

- // Clearing the notice by relying on the event bubbling
- <NewsletterForm onInput={() => setError(null)} … />
+ <NewsletterForm onFieldChange={() => setError(null)} … />

- // One alert for the whole form, losing the second message
+ <NewsletterForm fieldErrors={{ name: …, email: … }} … />
```

And the bell:

```diff
- import { Bell } from '../icons/bell.tsx';
+ import { social } from '@eduardoalvarez/arrecife';
+ // <social.Newsletter />
```

And `brand-icons.tsx`, which existed only because a namespace cannot cross the
RSC boundary — the wrapper is what put the property access back on the client
side. `./social` removes the need for it:

```diff
- 'use client';
- import { social } from '@eduardoalvarez/arrecife';
- export const LinkedIn = (p) => <social.LinkedIn {...p} />;
- export const Instagram = (p) => <social.Instagram {...p} />;
+ // Nothing. Import them where they are used:
+ import { LinkedIn, Instagram } from '@eduardoalvarez/arrecife/social';
```

Two `<svg>` stop being client components, and the Server Component that renders
them stops dying at prerender.

---

### What is new and breaks nothing

- **`Button variant="destructive"`** and **`destructiveOutline`**. For the
  irreversible only, and never inside an `AlertDialog` — there the confirm button
  stays as it was, because the title, the focus on cancel and the
  no-close-on-outside already carry the gravity. See
  [`decisions.md`](decisions.md) § 21.
- **`Button size="icon-sm"`**, 32×32, for a table row. It does not replace
  `icon`, which is still 42 and is still what a page action uses.
- **`ArticleCard`'s `tagAsChild`**, so an E2E suite can reach the tags without
  selecting by structure or by a style class:

  ```tsx
  <ArticleCard tagAsChild={({ tag }) => <span data-testid={`tag-${tag}`}>{tag}</span>} … />
  ```

- **`TalkCard`'s `resources`**, **`NewsletterForm`'s `aside`**,
  **`resetOnSuccess`**, **`onFieldChange`** and **`fieldErrors`**.
- **`social.Newsletter`**, the bell.
- **`Stat`'s `delta` and `spark`**, and the `achievement` tone, which together
  cover the seven pieces `cursos` was keeping its own KPI card for:

  ```tsx
  <Stat
    label="inscripciones"
    value="312"
    delta={{ value: '+18 esta semana', direction: 'up' }}
    spark={<TuSparkline points={…} />}
  />
  ```

  `direction` picks the arrow and never the colour — «+12 alumnos» and «+12
  errores» point the same way and mean opposite things — and `spark` is a
  `ReactNode` so no charting library reaches the barrel.
- **`EmptyState variant="inline"`**, the hole inside a table page or a dashboard
  widget: no face, no surface, no border. The type does not accept an
  `expression` there. `page` is the default, so nothing written before this
  moves. It is what replaces the 19 hand-written empty states in `cursos` and the
  18 in `blog-content-manager`.
- **`./social`**, the nine icons loose and with no `"use client"`. `import
  { LinkedIn } from '@eduardoalvarez/arrecife/social'` is the form to reach for
  from now on, and from a Server Component it is the only one that works — the
  grouped `social` from the root resolves to `undefined` there, because a client
  reference crosses the boundary per export and the properties of a plain object
  are not exports. The root keeps the group, unchanged, for iterating the
  catalogue. See [`decisions.md`](decisions.md) § 26.
- **The footer's caret**, which blinks. It arrives on its own — there is no prop
  and nothing to turn on. Behind `motion-safe`, so a reader who asked for less
  motion sees it solid.

### What did not change

Every colour, size, radius and contrast ratio that already existed. The three new
tokens — `danger`, `dangerHover`, `dangerOn` — are additions, and every existing
one is untouched. The suite passes identically in both modes before and after.
