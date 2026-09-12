# § 29 · The system adopts Phosphor, and it still ships no icons

**Release:** 0.7.0 · **Status:** Completed in § 51 · [index](README.md)

---

**Document:** neither the design system nor the brand manual mentions an icon
set. The only stroke either of them names is the footer's — «marcas en sólido,
funcionales en trazo 1.6».
**Code:** `@phosphor-icons/react` is an optional peer dependency, `./icons`
publishes an `Icon` wrapper, and `lib/glyphs.tsx` is unchanged and still
unpublished.

**The position that no longer holds.** «The system has no icons» was right for
what the library was — five reading sites, where `glyphs.tsx` covers everything a
primitive needs — and it stopped being right when an admin panel arrived. Counted
across the four consumers:

| Project | Distinct | Imports | Used once |
| --- | --- | --- | --- |
| `cursos` | 89 | 229 | 39 |
| `blog-content-manager` | 9 | 9 | 9 |
| `eduardoalvarez.dev` | 0 | 0 | — |
| `links` | 0 | 0 | — |

**The set was never the problem.** Seventy-seven of the 89 are domain icons for a
course admin — `GraduationCap`, `Ticket`, `Webhook`, `FlaskConical` — and no
design system was ever going to ship them. **What was broken is that nobody said
how they should be DRAWN**, so they were sized by hand in five ways: `size-4`
twenty-six times, then `size-3.5`, `size-3`, `size-6` and `size-7`, with no rule
behind any of them.

**Why Phosphor and not a stroke-width set.** Phosphor bakes the weight into the
path instead of exposing `strokeWidth`, and its `regular` lands almost exactly on
the one stroke the document names. Measured on the `Minus` path itself, whose
regular form is a bar of radius 8 on a 256 grid:

| | Line | As a fraction of the rendered size |
| --- | --- | --- |
| phosphor `regular` | 16 on a 256 grid | **0.0625em** |
| the document | 1.6 on a 24 grid | **0.0667em** |
| phosphor `light` | 12 on a 256 grid | 0.0469em |
| phosphor `bold` | 24 on a 256 grid | 0.0938em |
| `lib/glyphs.tsx` | 1.75 on a 16 grid | 0.109em |

Six per cent apart, which is no pixel on any screen. **Nothing had to be derived
and no number had to be invented**: `regular` IS the system's line. That is the
whole argument for this set over one that exposes a stroke width, where the
number would have had to be chosen and defended.

Two independent sources agree on it: the identity document, and the design canvas
the panel was drawn from — its sidebar and its KPI cards are Phosphor at
`regular`.

**`lib/glyphs.tsx` is the outlier, and it is NOT reconciled here.** At 0.109em it
is three quarters heavier than both the document and Phosphor's regular, and it
was never argued anywhere — it is what a 1.75 stroke happens to be on a 16 grid.
Aligning it would restyle every primitive in the library, which is a visible
change to every story in both modes and is its own decision. It is recorded here
so the next reader knows it is a known gap and not an oversight.

**The size is 1em**, which is Phosphor's own default and also the rule every icon
in this library already follows. Beside `text-label` it is 13px, beside `text-ui`
15px, and nobody picks a number.

**In Next, import from `@phosphor-icons/react/ssr` inside a Server Component.**
Phosphor's default build reads `IconContext` through `useContext`, and a hook in a
Server Component throws — and it ships **no** `"use client"` to stop you, so the
failure arrives at render rather than at build. The `/ssr` entry is the same icons
without the context read, and `Icon` works with either. This is better than the
alternative it replaces: an icon set whose every icon is a client component has no
escape hatch at all. It is the same boundary § 26 is about, seen from the side
where there is a way out.

**It is a subpath with an optional peer**, by the rule that already governs
`./form` and `./chart`: a heavy dependency never hangs off the root. The two
projects with zero icons install nothing and pay nothing.

**AN ICON IS NOT ILLUSTRATION, and adopting a set changed nothing about that.**
It is worth writing because the two had never had to be told apart before — until
this entry the library had one kind of drawing in it, and now it has two.

| | Tiburoncín | An icon |
| --- | --- | --- |
| What it is | the mascot: faces, poses, the fin | functional vocabulary |
| Where it lives | `./brand`, and the PNGs in `assets/` | `./icons`, from a third-party set |
| Who decides it | the brand manual, by surface — § 09 | the call site, wherever a control needs a label it cannot spell |
| Where it may appear | empty states, confirmations, errors, course progress, celebration. Nowhere else | anywhere |

Neither substitutes for the other in either direction. An icon does not get to
stand in for a face in an empty state, which is why `EmptyState`'s `page` variant
still demands an `expression` and § 31's `inline` variant takes an `icon` and
refuses a face at the type level. And a face is not a control's label: it carries
tone, not meaning.

The manual's dosage is untouched by any of this. It was written about
illustration and it still governs illustration; a set of functional glyphs is a
category it never described and never restricted.

**Action in the document:** add an icon line to the design system — «iconos de
interfaz · Phosphor a 1em y peso `regular`, que es el mismo trazo 1.6 escrito en
otra retícula · los glifos internos van más pesados y hay que igualarlos».

---
