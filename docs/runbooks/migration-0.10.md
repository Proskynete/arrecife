# Migrating to 0.10.0

Two breaking changes and they are the same change twice: the library stopped
drawing icons of its own.

`@phosphor-icons/react` becomes a **required** peer dependency, and the
`./social` subpath is **deleted**. Everything else in this release is additive —
the footer centres on a phone, three rows stop pushing the page sideways, the
toast finally carries a colour, and Storybook gets a way in — and none of it asks
anything of a consuming project.

If you are coming from 0.7.x, do [`migration-0.8.md`](migration-0.8.md) first.

The argument for all of it is in [`../decisions/`](../decisions/README.md#0100),
§§ 51–56.

---

## The breaking changes

### 1 · Install `@phosphor-icons/react`, whether or not you draw icons

```bash
pnpm add @phosphor-icons/react
```

It was an optional peer dependency since 0.7.0 and it is required now. **This
applies even if your project draws no icons at all**: the `Alert`, the `Select`,
the `Button` and the `Accordion` you already import draw with it. Without it the
install warns and the build fails on module resolution, which is at least loud.

Two of the five projects are in that position — `links` and `resume` — and it is
worth being straight about the trade. They gain a dependency they did not have.
It is `sideEffects: false` with a per-icon entry, so what ships is the eighteen
the library draws and nothing else, but a dependency that tree-shakes is still a
dependency.

**Why it stopped being optional:** an optional peer is honest while the library
has a set of its own to fall back on, and it does not any more. See § 51.

### 2 · `@eduardoalvarez/arrecife/social` is gone. All ten are in Phosphor

```diff
- import { GitHub, LinkedIn, Website } from '@eduardoalvarez/arrecife/social';
+ import { GithubLogo, LinkedinLogo, Globe } from '@phosphor-icons/react';
+ import { Icon } from '@eduardoalvarez/arrecife/icons';

- <GitHub />
+ <Icon as={GithubLogo} tone="current" />
```

The grouped form at the root goes with it:

```diff
- import { social } from '@eduardoalvarez/arrecife';
- <social.LinkedIn />
+ import { LinkedinLogo } from '@phosphor-icons/react';
+ <Icon as={LinkedinLogo} tone="current" />
```

The whole mapping, and the `tone` column is the old drawing rule — brands SOLID,
functional icons on the system's line — written on the axis `Icon` already has:

| Removed | Phosphor | `tone` |
| --- | --- | --- |
| `GitHub` | `GithubLogo` | `current` |
| `LinkedIn` | `LinkedinLogo` | `current` |
| `X` | `XLogo` | `current` |
| `Instagram` | `InstagramLogo` | `current` |
| `Discord` | `DiscordLogo` | `current` |
| `YouTube` | `YoutubeLogo` | `current` |
| `Rss` | `Rss` | `action` (the default, omit it) |
| `Email` | `Envelope` | `action` |
| `Newsletter` | `BellSimple` | `action` |
| `Website` | `Globe` | `action` |

**In a Next Server Component, import the glyph from `@phosphor-icons/react/ssr`.**
`./icons` carries no `"use client"` on purpose, so an icon renders on the server
and ships no client JS — but Phosphor's default build reads `IconContext` through
`useContext`, and a hook in a Server Component throws. The `/ssr` entry is the
same icons without that read, and `Icon` works with either.

```tsx
// A Server Component.
import { GithubLogo } from '@phosphor-icons/react/ssr';
import { Icon } from '@eduardoalvarez/arrecife/icons';
```

**Where to look for these.** They are typed, so `tsc` finds every one of them.
Nine call sites across two projects at the time of writing: three files in
`cursos` and five in `blog-content-manager`. `links` and `eduardoalvarez.dev`
had already moved to Phosphor on their own, which is most of why this happened.

### `./social/data` goes too, and nothing replaces it

It published the ten shapes with no React attached, for a project that mounts
none. It has no consumer left: `links` draws Phosphor through `astro-icon` by
Iconify name, which is the same set from the same source. If you were using
`socialSvg`, `socialGlyphs` or a loose `…Glyph`, the replacement is `astro-icon`
with `ph:github-logo-fill` for a brand and `ph:rss` for a functional mark — the
unsuffixed name is Phosphor's `regular`, which is what `tone="action"` resolves
to.

---

## What changed without asking anything of you

### The footer centres itself on a phone

The default shape stacks and centres below `sm`; `variant="full"` centres its
brand block and its columns below `md`, and its column grid starts at one column
instead of two. Above those widths nothing moved.

If your project was correcting this from outside — `links` was, in its Astro
replica — the override is now the same as the default and can go.

### Three rows stop pushing the page sideways

`Nav`'s item list and `TabsList` scroll horizontally when they do not fit;
`PaginationContent` wraps and centres. Nothing about them changes at a width
where they already fitted.

**One thing this does NOT fix, and it is yours.** `Nav` does not hide its items
below a breakpoint, because hiding navigation is only safe if something else
exposes it. If your project composes a drawer into `actions` — `eduardoalvarez.dev`
does, out of `Sheet` — you now show a scrolling nav row next to a hamburger on a
phone. The fix is one class in your project:

```diff
- <Nav brand={brand} actions={actions}><NavLinks pathname={pathname} /></Nav>
+ <Nav brand={brand} actions={actions}>
+   <span className="hidden sm:contents"><NavLinks pathname={pathname} /></span>
+ </Nav>
```

`contents` and not `block`: `Nav` renders the `<ul>` and the items arrive as bare
`<li>`s, so a wrapper that generates a box would put a `<span>` between them.

### `Toast` carries a colour again

`success` and `error` now draw the semantic colour solid on the border, at 10 %
as a tint, and with a mark — `CheckCircle` and `WarningCircle`. `neutral` is
unchanged. Nothing in your call sites moves: `toast.success(…)` and
`toast.error(…)` are the same two functions.

### `AudioPlayer`'s waveform is Phosphor's `Waveform`

The five bars beside «Narración de audio» were drawn inline in the component.
They are the same five bars from Phosphor now, at the same size and in the same
accent, and they still dim when paused. Nothing in your call sites moves.

### `Alert`'s four marks are Phosphor now

`✦ ✓ ! ✕` become `Info`, `CheckCircle`, `Warning` and `XCircle`. If you were
passing `icon` to override the character, keep passing it — the prop is
unchanged, and the type is still `ReactNode`.

### `ThemeToggle` actually toggles without `onThemeChange`

A real bug, reported inside `eduardoalvarez.dev`'s own `site-nav.tsx` and fixed
here. The handler read `onThemeChange?.(toggleTheme())`, and optional call
short-circuits its arguments: with no `onThemeChange`, `toggleTheme()` never ran
and the button did nothing at all. The prop was documented as optional and was
mandatory in practice.

**If you were passing a handler only to make the control work, you can stop.**
Keep it if you were recording the change.

### Storybook has a way in

`Arrecife/Getting started` is the first page in the sidebar: install, the two
`@import` lines, the font names, and the prompt to hand an agent. Every component
page also carries a generated «Using it with an agent» block with the import for
that component. Nothing to install — it is the published Storybook at
<https://arrecife.eduardoalvarez.dev>.

---

## The order to do this in

1. `pnpm add @phosphor-icons/react`.
2. `pnpm add @eduardoalvarez/arrecife@0.10.0`.
3. Run `tsc`. Every `./social` import is an error and the table above is the
   mapping. In a Server Component, import the glyph from
   `@phosphor-icons/react/ssr`.
4. If your project composes a mobile drawer into `Nav`'s `actions`, wrap its
   items in `hidden sm:contents`.
5. Open the footer on a phone and delete whatever you were using to centre it.
6. `pnpm dlx @eduardoalvarez/arrecife arrecife` — the package's own doctor —
   still checks `@source` and token collisions, and neither changed here.
