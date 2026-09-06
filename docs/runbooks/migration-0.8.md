# Migrating to 0.8.0

Four breaking changes. Three of them are lines you **delete** rather than lines
you rewrite, and the fourth is a component that leaves because nobody was
importing it. Everything else is additive, and most of it exists so a project can
delete something it was maintaining by hand: 197 lines of footer, four charts,
four hand-pasted SVG paths and fourteen copies of the same wrapper `div`.

**Three of the four are the library taking something back out**, and they are
worth reading together: a motion utility, a footer row and a whole component,
all removed for the same reason — nothing in any of the four projects drew them.
See [`../decisions/0.8.md`](../decisions/0.8.md#45--the-signatures-mark-is-the-halo-and-the-library-had-invented-the-blink) § 45, § 47 and § 48.

If you are coming from 0.6.x, do [`migration-0.7.md`](migration-0.7.md) first.

---

## The breaking changes

### `Table` draws its own surface, so your wrapper has to go

```diff
- <div className="rounded-lg border border-border bg-card overflow-hidden">
-   <Table>…</Table>
- </div>
+ <Table>…</Table>
```

`Table` now carries `rounded-card`, `border-hairline` and the clip. Keeping your
wrapper gives you **two borders**, which is visible the moment you open the page
— nothing fails, so the type checker will not point at these. Search for the
element that wraps a `<Table>` and remove its radius, its border and its
`overflow-hidden`.

**Why it moved.** `TableRow` tints a `<tr>` on hover and a `<tr>` is a rectangle.
Nothing clipped it, so the tint of the header row and of the last row spilled out
through your wrapper's rounded corner. The fix from outside is `overflow-hidden`
on that wrapper, and it worked exactly as far as somebody remembering it: five
tables in `cursos` had it, nine in `blog-content-manager` did not.

**One thing you gain without asking.** The scroll container is now focusable, so
a keyboard user can reach the columns that sit off screen. That has been broken
since the container started scrolling, and it means a table is one more tab stop
than it used to be — which is the deliberate trade, because a region a keyboard
cannot reach is content that is not there.

**If your table sits inside a card** and now reads as a box in a box, that is the
one case this shape does not serve yet. Say so — a second shape gets a prop when
there is a second consumer, and right now fourteen call sites wanted the same one.
See [`../decisions/0.8.md`](../decisions/0.8.md#39--the-table-carries-its-own-surface) § 39.

### The `caret` utility is removed

```diff
- <span className="bg-accent motion-safe:caret inline-block h-[1em] w-[0.5em]" />
+ <span className="bg-accent motion-safe:pulse-accent rounded-pill inline-block h-[1em] w-[2px]" />
```

If you never wrote `caret` by hand, this costs you nothing and you can skip it —
the four projects were checked and none of them did. If you did, the class stops
resolving and **nothing fails**: Tailwind drops an unknown utility silently, so
your mark goes still with no error anywhere. That is the reason it goes now,
while the surface is one release old, rather than later.

`pulse-accent` is the replacement and it is not the same effect, which is the
point: the bar stays solid and radiates instead of switching on and off. Make it
thin — 2px, or a small dot — because a halo needs something to radiate from.

**Why remove it instead of leaving it published.** `caret` shipped in 0.6.0 as
the footer signature's mark, and 0.8.0 replaces that mark because both sites that
draw the signature already had a different one: the library had invented an
effect where it was supposed to be recording one. With the footer no longer
drawing it, the utility had no consumer in the library and never had one outside
it, and the argument that justified it was reasoned about terminals in the
abstract rather than read off the projects. A published utility is normally not
withdrawn the day its consumer changes its mind; this one had no consumer to
change its mind, and leaving it in the package leaves the invention there under a
label that makes it look like a feature.

It also puts the motion rule back to one criterion. See
[`../decisions/0.8.md`](../decisions/0.8.md#45--the-signatures-mark-is-the-halo-and-the-library-had-invented-the-blink) § 45, and § 23 for the entry it reverses.

### `Footer` takes no loose links, and `FooterLink` is gone

```diff
- <Footer brand={<Logo />} social={networks}>
-   <FooterLink href="/rss.xml">./rss</FooterLink>
-   <FooterLink href="/aviso-legal">./aviso-legal</FooterLink>
- </Footer>
+ <Footer
+   variant="full"
+   brand={<Logo />}
+   social={networks}
+   columns={[
+     { title: 'legal', links: [
+       { label: 'aviso legal', href: '/aviso-legal' },
+       { label: 'rss', href: '/rss.xml' },
+     ]},
+   ]}
+ />
```

`children` is omitted from the props, so this one DOES fail at compile time —
the only break in this release that does. If you passed no children, nothing
changes for you: `brand`, `social`, `year` and `signatureHref` are untouched and
the default shape renders exactly as it did.

Do not write the `./` in the label. The columns put it there and mark it
`aria-hidden`, so a screen reader says «aviso legal» and not «punto barra aviso
legal» — which is the half a hand-written row got wrong.

**Why it goes.** No project passed those links. `eduardoalvarez.dev` passes
`brand` and `social`; `links` is an Astro replica with the glyph row and the
prompt; `cursos` has three columns, which is what a flat row cannot express — it
cannot say which block a link belongs to, so a screen reader walks the lot
instead of jumping to «Legal» by heading. See [`../decisions/0.8.md`](../decisions/0.8.md#47--the-footer-takes-no-loose-links-and-the-columns-are-why) § 47.

### `SidebarNav` is removed

```diff
- import { SidebarNav, SidebarGroup, SidebarItem } from '@eduardoalvarez/arrecife';
```

`SidebarNav`, `SidebarGroup` and `SidebarItem` are gone. **If you are one of the
four projects, this costs you nothing**: neither admin app imported it. `cursos`
uses shadcn's `components/ui/sidebar.tsx` and `blog-content-manager` has its own
`src/components/sidebar/Sidebar.tsx`.

If you did import it, build the sidebar from `Nav` and `Sheet` — which is what
both admin projects already did. `Sheet side="left"` is the mobile drawer, and
`Nav` carries the item states; a component wrapping the two encodes no rule
neither of them already has.

**Why it goes.** The entry criterion is «it encodes an identity rule, it has two
or more consumers, and it drags in no project infrastructure», and it never had
the middle one. The two consumers were counted as projects that COULD use it
rather than projects that DID. See [`../decisions/0.8.md`](../decisions/0.8.md#48--sidebarnav-goes-and-the-entry-criterion-is-why) § 48, and § 32
and § 34 for the entries it reverses.

---

## Run this first

```
npx arrecife
```

Unchanged in what it checks, and **less noisy in one specific case**: it no
longer asks for an `@source` from a project that imports the tokens but renders
no component of ours. If everything you import is `./tokens`, `./theme`,
`./variants`, `./social/data`, `./og` or `./shiki`, the directive is not needed
and adding it makes Tailwind generate the whole library for markup that is not
there — measured at 16 KB → 52 KB in `links`. You now get a note saying so
instead of a failure. See [`../decisions/0.8.md`](../decisions/0.8.md#46--the-doctor-stops-asking-links-for-a-directive-it-must-not-add) § 46.

The token-collision half is unchanged, and it is still the one that costs hours:
a `@theme inline { --color-accent: var(--accent); }` from shadcn repaints the
library's own components grey.

---

## Two things that were broken and now are not

### `NavItem asChild` works

It failed **every** time, with `Slot failed to slot onto its children`. The
component wraps `children` with its own `./` and with brackets when active, so
Radix's `Slot` was handed four children where it takes one. It passed `tsc` and
it passed the build; it broke at render.

```tsx
<NavItem asChild active={pathname === '/articulos'}>
  <Link href="/articulos">artículos</Link>
</NavItem>
```

If you worked around it with a bare `<NavItem href>`, that link was costing a
full page load instead of a client transition. See
[`../decisions/0.8.md`](../decisions/0.8.md#40--navitem-aschild-was-declared-typed-and-impossible-to-call) § 40.

### `ref` is in the type of the form controls

`Input`, `Textarea`, `Label` and `DateField` declare `ComponentProps` instead of
`ComponentPropsWithoutRef`, so `ref` is a prop the type admits — which it already
was at runtime.

```diff
- <div ref={wrapper}>
-   <Input placeholder="Buscar" />
- </div>
- // …later: wrapper.current?.querySelector('input')?.focus()
+ <Input ref={field} placeholder="Buscar" />
+ // …later: field.current?.focus()
```

If you took a `ref` on a wrapping element and reached the control with a
`querySelector`, that detour was around a type and not around a behaviour. See
[`../decisions/0.8.md`](../decisions/0.8.md#41--ref-is-a-prop-in-react-19-and-the-types-said-otherwise) § 41.

---

## What you can delete

### The footer of an app, if it has columns

`Footer` has a second shape. **Passing nothing changes nothing** — if you use
`Footer` today, this release does not touch you.

```tsx
<Footer
  variant="full"
  brand={<Logo />}
  description="Cursos para construir con IA, directos y al grano."
  columns={[
    { title: 'Aprendizaje', links: [{ label: 'Cursos', href: '/cursos' }] },
    { title: 'Legal', links: [{ label: 'Términos', href: '/terminos' }] },
  ]}
  social={SOCIAL}
  action={<Button variant="tertiary" size="sm">Reportar un problema</Button>}
  signatureHref="/"
  linkAsChild={({ href, children }) => <Link href={href}>{children}</Link>}
/>
```

`columns`, `description`, `action` and `linkAsChild` exist **only** on `full`:
the props are a union, so the default form cannot be handed one and there is no
third shape to design by accident. The `./` in front of each column link is put
there by the component, like `NavItem`'s, and it is `aria-hidden`.

The signature closes the footer on its own row behind a hairline, centred below
`sm` and right-aligned above. See [`../decisions/0.8.md`](../decisions/0.8.md#44--the-footers-second-shape-and-why-the-first-one-is-the-default) § 44.

### A chart written by hand

`./chart` publishes three types on top of the chassis that was already there:

```diff
- <ChartContainer config={config} className="h-[200px] w-full">
-   <AreaChart data={data} margin={{ left: 0, right: 12, top: 8 }}>
-     <defs>
-       <linearGradient id="fillRegistros" x1="0" y1="0" x2="0" y2="1">
-         <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.5} />
-         <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.05} />
-       </linearGradient>
-     </defs>
-     <CartesianGrid vertical={false} strokeOpacity={0.15} />
-     …
-   </AreaChart>
- </ChartContainer>
+ <AreaChart
+   label="Registros nuevos por día"
+   summary="Sube de 24 a 52 con una caída en mayo."
+   height={200}
+   data={data}
+   series={[{ key: 'count', label: 'Registros' }]}
+   xKey="day"
+ />
```

`AreaChart`, `BarChart` and `LineChart` take `data`, `series` and `xKey`. The
gradient, the grid, the axes and the tooltip are the component's.

Two notes. **The names collide with Recharts' on purpose** — you import ours, not
both, and this library's own module aliases theirs. And
**`orientation="horizontal"` means the bars lie down**, against Recharts'
`layout="vertical"`, which means the same thing and reads as the opposite. See
[`../decisions/0.8.md`](../decisions/0.8.md#43--the-chart-types-take-the-names-recharts-uses) § 43.

A doughnut has no type and is not missing one: `ChartContainer` plus Recharts'
`Pie` is still the answer.

### A hand-pasted SVG path, if you mount no React

The glyphs are published as data at `@eduardoalvarez/arrecife/social/data`, which
imports nothing:

```astro
---
import { socialSvg } from '@eduardoalvarez/arrecife/social/data';
---
<Fragment set:html={socialSvg('GitHub', { class: 'size-[19px]' })} />
```

`socialGlyphs` is the whole catalogue keyed by name, `socialNames` is the ten
names, and each glyph is exported on its own — `gitHubGlyph`, `websiteGlyph` —
if you want the shapes rather than the markup.

The React components are drawn from that same file, so a `d` that changes changes
in both. See [`../decisions/0.8.md`](../decisions/0.8.md#42--the-glyphs-are-data-and-the-tenth-one-is-ours) § 42.

### A borrowed globe

`Website` is the tenth glyph in `./social`, functional like `Email` and drawn to
the catalogue's own proportions:

```diff
- import { Globe } from '@phosphor-icons/react/ssr';
+ import { Website } from '@eduardoalvarez/arrecife/social';
```

---

## The footer signature's mark changes

If you use `Footer`, the mark at the end of the CLI signature is no longer a
blinking block. It is a **2px bar that stays solid and radiates a halo** — the
`cursor-ping` effect `cursos` and `eduardoalvarez.dev` both wrote before this
library had a `Footer`, published here as `pulse-accent`.

Nothing to do: it comes with the component. Two things you can now delete if you
have them:

```diff
- /* Terminal cursor ping */
- @keyframes cursor-ping {
-   0%, 100% { box-shadow: 0 0 0 0 rgba(53, 214, 192, 0.7); }
-   50%      { box-shadow: 0 0 0 5px rgba(53, 214, 192, 0); }
- }
```

`eduardoalvarez.dev` has those keyframes in `src/assets/styles/base.css` with
nothing rendering them — adopting the library's `Footer` replaced its mark with
the blink, which is what this release undoes. `cursos` has the same block in
`app/globals.css`, and it goes when its footer moves to `variant="full"`.

**One difference from what `cursos` ships, and it is deliberate.** The library
puts the halo behind `motion-safe`; `cursos`'s span animates regardless of the
system's reduce-motion setting. The blog's version was guarded, every other
motion exception here is guarded, and at rest the bar is simply solid.

The `caret` utility that used to draw the blink is removed — see [the breaking
changes](#the-caret-utility-is-removed). With it goes the second criterion § 23
had opened to admit it, so the system is back to **five** motion exceptions with
**one** criterion: feedback about progress or about spatial continuity.

## One utility you can use elsewhere

`pulse-accent` is not only the signature's: it is the system's mark for
**something that is running right now**.

```tsx
<span aria-hidden="true" className="bg-accent motion-safe:pulse-accent rounded-pill inline-block size-2" />
```

Use a thin or small shape. A halo needs something to radiate from, and around a
wide block the ring reads as a glowing rectangle.

## The short version

| Change | What it costs you |
| --- | --- |
| `Table` draws its own surface | Delete the wrapper. Nothing fails; you see two borders |
| `Table`'s scroll region is focusable | Nothing. One more tab stop, and columns off screen become reachable |
| `NavItem asChild` works | Nothing. Replace the `<NavItem href>` workaround if you have one |
| `ref` on `Input`, `Textarea`, `Label`, `DateField` | Nothing. Delete the `querySelector` detour if you have one |
| `Footer variant="full"` | Nothing unless you ask for it |
| `AreaChart`, `BarChart`, `LineChart` | Nothing. They replace what you wrote by hand |
| `./social/data` | Nothing. It replaces a pasted `<path>` |
| `Website` glyph | Nothing. It replaces a borrowed one |
| The footer signature's mark | Nothing. It becomes the halo both sites already drew; delete your `cursor-ping` keyframes |
| `caret` is removed | Nothing unless you wrote the class by hand. Then the mark goes still with no error: use `pulse-accent` |
| `Footer` takes no `children` | Nothing unless you passed loose links. This one DOES fail at compile time: move them to `variant="full"` columns |
| `FooterLink` is removed | Nothing. It only styled the row that went |
| `SidebarNav` is removed | Nothing for the four projects — neither admin app imported it. Otherwise: `Nav` inside a `Sheet` |
| `pulse-accent` | Nothing. New utility, also usable outside the footer |
| `npx arrecife` on a React-less project | One fewer false failure |
