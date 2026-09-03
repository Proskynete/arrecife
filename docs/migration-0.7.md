# Migrating to 0.7.0

One breaking change, and it is a find and replace the type checker points at.
Everything else is additive, and most of it exists to let a project **delete**
something it was maintaining by hand.

If you are coming from 0.5.x, do [`migration-0.6.md`](migration-0.6.md) first:
this guide assumes the English API.

---

## The breaking change

### `Stat`'s `tone="alerta"` is `tone="alert"`

```diff
- <Stat value="0" label="design systems" tone="alerta" />
+ <Stat value="0" label="design systems" tone="alert" />
```

The last public API value still in Spanish, and the only one `llms.txt` was
publishing — which meant an agent reading the document from a consuming project
wrote Spanish into a library that had decided it would not have any.

Nothing else moves: same colour, same rule, same `neutral` default. `tsc` points
at every call site and there is nowhere for it to hide, because `tone` is not a
string a project computes.

---

## Run this first

```
npx arrecife
```

It checks the two failures that produce **no error**, and both cost hours in the
last migration.

**A missing `@source`.** Tailwind does not scan `node_modules`, so without the
directive every class the components emit is purged — `p-step-lg`,
`rounded-card`, `border-hairline`. No console error, no build warning, no
undefined class: the component mounts, undressed. The command works out the path
for you, counted from the stylesheet and not from the project root, which is the
half that gets written wrong.

**A token of yours redefining one of ours.** A project coming from shadcn brings
`@theme inline { --color-accent: var(--accent); }`, and the two are not the same
colour: shadcn's `--accent` is the hover **surface**, `#17303E`, and this
library's is the brand turquoise, `#35D6C0`. That one line repainted **88 classes
inside the library's own components** grey — 28 `text-accent`, 26
`outline-accent`, 15 `bg-accent`, 12 `border-accent`. Buttons, focus rings and
badges came out the colour of a surface, and it looked as though the migration
had achieved nothing.

Five names collide with shadcn's; four agree on their value and are harmless, and
the command tells them apart instead of failing on all five. See
[`decisions.md`](decisions.md) § 33.

---

## What you can delete

| Project | What comes out |
| --- | --- |
| `blog-content-manager` | `src/components/ui/brand-icons.tsx`, the `"use client"` wrapper around two `<svg>` |
| `cursos` | `components/admin/kpi-card.tsx`, 83 lines, and its own `site-header.tsx` |
| both | The empty states written by hand — 19 files in `cursos`, 18 in `blog-content-manager` |

`brand-icons.tsx` existed only because a namespace cannot cross the RSC boundary;
the wrapper is what put the property access back on the client side. `./social`
removes the need for it:

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

## What is new and breaks nothing

### `./social`, the nine icons loose

```tsx
import { LinkedIn } from '@eduardoalvarez/arrecife/social';
```

**From a Server Component it is the only form that works.** The root carries
`"use client"`, and a client reference crosses the boundary per EXPORT — the
properties of a plain object are not exports, so `social.LinkedIn` is `undefined`
on the server and `undefined` as an element type kills the build at prerender.
The root keeps the group, unchanged, for iterating the catalogue. See
[`decisions.md`](decisions.md) § 26.

### `./icons`, and the system adopts Phosphor

```diff
- <GraduationCap className="size-4" />
- <Search className="size-3.5" />
+ <Icon as={GraduationCap} />
+ <Icon as={MagnifyingGlass} />
```

The library still ships **no icons**. What it now ships is how they are drawn:
1em instead of five hand-picked sizes, and weight `regular` — 16 on Phosphor's
256 grid, or 0.0625em, against the 0.0667em the document names as «trazo 1.6».
Six per cent apart, so nothing had to be derived.

`@phosphor-icons/react` is an **optional** peer dependency: a project that uses
no icons installs nothing. In a Next Server Component import from
`@phosphor-icons/react/ssr` — the default build reads `IconContext` through
`useContext` and ships no `"use client"` to stop you, so the failure arrives at
render. See [`decisions.md`](decisions.md) § 29.

**Icons are not illustration.** Tiburoncín — the faces, the poses, the fin — is
the mascot, it lives in `./brand`, and the manual doses it by surface. An icon
from `./icons` is functional vocabulary and never replaces it, in either
direction. See [`decisions.md`](decisions.md) § 29.

### `EmptyState variant="inline"`

The hole inside a table page or a dashboard widget: no face, no surface, no
border. The type does not accept an `expression` there, on purpose — an admin
screen has a dozen empty regions and a dozen mascots is not the humour contract.
`page` is the default, so nothing written before this moves.

### `Stat` covers the KPI cards

```tsx
<Stat
  label="inscripciones"
  value="312"
  delta={{ value: '+18 esta semana', direction: 'up' }}
  spark={<TuSparkline points={…} />}
/>
```

`direction` picks the arrow and **never** the colour — «+12 alumnos» and «+12
errores» point the same way and mean opposite things — and `spark` is a
`ReactNode`, so no charting library reaches the barrel. `tone="achievement"` is
the third value, for the number that is the opposite of a problem.

**The card also looks different, and no prop changed.** `icon` is now a badge in
the corner opposite the title, in a circle tinted at 10 % of the tone; the
sparkline is pinned to the bottom edge so a row of cards shares one baseline; and
a NEUTRAL number renders in primary ink instead of biolume, because the badge and
the line now carry the tone. `alert` and `achievement` still paint the number
sand. See [`decisions.md`](decisions.md) § 31.

### `SidebarNav` groups, collapses, and takes who is signed in

```tsx
<SidebarNav collapsed={collapsed} onCollapsedChange={setCollapsed} brand={…} mark={…} user={…}>
  <SidebarItem href="/admin" icon={<Icon as={SquaresFour} />} active>Resumen</SidebarItem>
  <SidebarGroup label="Ventas">…</SidebarGroup>
</SidebarNav>
```

Eleven flat items is where a sidebar stops being readable. Each group is a nested
list named by its label, so a screen reader gets «lista Ventas, 3 elementos»
instead of one list of eleven. `icon` **replaces** the `▸` rather than joining it,
and a sidebar with no icons keeps the prompt — nothing written before this moves.

The rail is controlled: this state is almost always persisted, and an internal one
would fight the cookie you already keep. Its chevron comes from the library's own
glyphs, so a project that installs no icon set still gets the button. See
[`decisions.md`](decisions.md) § 32 and § 34.

### `Nav size="compact"`

56px instead of 64, for a bar that shares the screen with a sidebar. It is a prop
and not a class because the height lives on the inner container, so passing
`h-14` from outside did nothing — silently. The other two things a header wants
were already slots: `brand` takes a `~/cursos` wordmark and `actions` takes a user
menu or a «Entrar» button. See [`decisions.md`](decisions.md) § 30.

---

## What did not change

Every colour, size, radius and contrast ratio that already existed. The new
tokens — `navCompact`, `sidebar`, `sidebarRail` — are additions. The suite passes
axe in both modes before and after.
