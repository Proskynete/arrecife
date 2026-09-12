# § 30 · `Nav` needed one of the three things the backlog asked for

**Release:** 0.7.0 · [index](README.md)

---

**Backlog:** `cursos` keeps its own header because `Nav` lacks a `~/` brand
prefix, a user menu, and a 56px height.
**Code:** one new prop, `size="compact"`. The other two were already there.

The entry exists because two of the three asks were wrong, and «we looked and it
was already covered» is worth writing down — otherwise the next reader implements
them.

**The `~/` prefix already exists**, and in a place the backlog did not look:
`Nav` renders it before the section list, `aria-hidden`, in mono muted. What
`cursos` wants is a different placement — `~/cursos` as the WORDMARK — and
`brand` is a `ReactNode` slot, so that composes today with no library change. The
two placements are not a contradiction: the manual's rule is that section titles
take the path format, and both do.

**The user menu is project infrastructure**, which is the third clause of the
criterion that decides what enters here: «it encodes an identity rule, it has two
or more consumers, and it drags in no project infrastructure». A user menu needs
a session, an avatar and a sign-out route. `actions` already takes it, and the
backlog's real complaint — «cada consumidor vuelve a decidir el orden y el
tamaño» — has one consumer, so there is nothing to converge on yet.

**The height was real, and not for the reason given.** `Nav` is 64px and `cursos`
is 56. The backlog framed it as a missing value; the actual defect is that the
height was **not overridable at all**. `h-nav` sits on the inner container and
`className` reaches the `<header>` and stops there, so a project passing `h-14`
got nothing, silently — the same class of failure as `p-md` landing on the
numeric scale. That is why it is a prop.

**56 is not «smaller because it looks better».** At 64 the header of an app shell
competes with the rail beside it for the same corner, and together they eat the
top of the content area. It is the same argument as § 22's `icon-sm`: the one
admin app of the five is denser than the four reading sites, and the answer is a
second value on the control that exists rather than a second component.

**A token, and the line that was missing.** `size.navCompact` went into
`tokens.ts` and did NOT come out of `build-tokens.mjs`, because the `size` group
is written line by line — two of its members are `--spacing-*` and two are
`--container-*`, so it cannot be looped. `h-nav-compact` resolved to nothing and
the bar silently kept its 64. `scripts/theme-css.test.mjs` now asserts the
utility, which is the check that exists for exactly this.

**A story the suite refused.** Showing both heights side by side meant two `Nav`s
on one page, and `Nav` renders the site's `banner` landmark — axe failed it with
`landmark-no-duplicate-banner`, which is the rule the component's own JSDoc
already states. The story was dropped and the reason written into a `Note`.

**Two projects keep their own header, and that is still fine.**
`eduardoalvarez.dev` keeps its by decision — a mascot fin, a two-line logotype,
Algolia search, a mobile drawer, all of it Astro islands — and the backlog
already recorded that no change is needed for it. `cursos` can now be built out
of `Nav`, `brand` and `actions` without one.

**Action in the document:** add the second bar height — «barra · 64px, o 56 en un
shell con barra lateral».

---
