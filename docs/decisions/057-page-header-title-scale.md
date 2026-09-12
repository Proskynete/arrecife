# § 57 · The page title's scale belongs to the screen, and the two admin apps agree on it

**Release:** 0.11.0 · [index](README.md)

---

**System rule:** «ENCABEZADO DE PÁGINA INTERNA … h1 44/700 · bajada 17px ·
párrafo de contexto 15px. Mismo patrón en las seis páginas internas.» That is
the design system's interior-page header, and `PageHeader size="page"` drew it.

**What the code did:** the title's scale came from `size` — `display` for
`display`, `h1` for everything else — and there was no way to ask for another.

**What was wrong with it.** The document describes the six interior pages of
the reading site, and the component applied it to every screen of every project.
The two admin apps do not title their screens at 44, and they arrived at the
same answer without talking to each other:

| Project | Page titles | Scale |
| --- | --- | --- |
| `blog-content-manager` | 12 | 24px, `<h1 className="text-2xl">` |
| `cursos`, the panel | 15 | 25px, `<Text as="h1" variant="h3">` |
| `cursos`, the student and lesson views | 14 | 25px, `<Text as="h1" variant="h3">` |
| `cursos`, the catalog, a course, a program | 3 | 30px, `<Text as="h1" variant="h2">` |

Counted on 2026-09-10 with `grep -rn '<h1' src | grep text-2xl` in
`blog-content-manager` and `grep -rn 'as="h1" variant="h[23]"' app` in `cursos`,
which has no other kind of `h1`. The backlog had counted 22 in `cursos`, at 24 and
30, before it moved them onto `Text`; the move put them on the scale's rungs and
did not change the answer. Two consumers agreeing on a size is the memo rule —
that IS the identity for a panel — and it is the same density the system already
recorded twice for the admin app, in `icon-sm` ([§ 22](022-dense-icon-size.md))
and `navCompact` ([§ 30](030-nav-compact-size.md)).

Adopting `PageHeader` in `cursos` would have turned thirty-two titles from 25 or
30 into 44. That is not a migration, it is a redesign of every screen's
hierarchy, and it is not a decision the person moving a header gets to make. So
`cursos` composed its headers from `Text` by hand, and wrote down why next to
the one on its home page, in `app/(public)/page.tsx`.

**What it is now:** `titleVariant`, one of `display`, `h1`, `h2` or `h3`. With
nothing passed the scale is what `size` gives, exactly as before.

**Why not a third `size`.** The backlog offered `size="compact"` for the case
where the system should keep deciding, and it was the more conservative option.
It does not fit what the projects do: `cursos` uses TWO scales under `h1` — `h3`
nearly everywhere and `h2` on its three catalog pages — and one more `size` names
one of them. It would also have had to decide the padding, and in a panel the
layout already spaces the content.

`titleVariant` is the split `Text` makes, and rule 6 in `llms.txt` states it:
`as` is the level, `variant` is how big it looks. `PageHeader` already exposed
the first half and hid the second.

**Why only four values.** The display family's headline scales. `stat` is a
number and `body` is not a headline.

**What stays with `size`:** the padding. A panel header passes `className="py-0"`
when its layout already spaces the content. That is one class at fifteen call
sites at most, and the alternative — padding that changes with the title's scale
— ties two things together that the projects do not tie.

**Action in the document:** say that the interior-page header's «h1 44/700» is
the reading site's, and that an admin panel titles its screens at `h3` (25px),
which is where both admin apps landed on their own. The section currently gives
one scale for «las seis páginas internas» and nothing for a panel.
