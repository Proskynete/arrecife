# § 27 · The empty state has a second shape, and it carries no face

**Release:** 0.7.0 · [index](README.md)

---

**Document:** `../architecture/design-system.md` — «estado vacío · una cara a 66px + título
15px/500 + explicación 13.5px muted». `../architecture/brand-manual.md` § 09 — «Admin del
blog · Solo la aleta. Sin caras salvo estados vacíos».
**Code:** two variants. `page` is the document's, unchanged and still with the
face mandatory. `inline` has no face and the type does not let one through.

**What the count said.** In `cursos` there are 19 files with an empty state
written by hand and 3 that use `EmptyState`. In `blog-content-manager`, 18 by
hand. The admin panel alone holds 20 distinct messages, and reading them is the
whole argument:

> Aún no hay alumnos · No hay entregas pendientes · No hay lecciones en esta
> página · No hay reportes que coincidan · Sin actividad en el rango

None of those is a screen. They are the hole in a table page and the hole in a
dashboard widget, and there are a dozen of them at once. The component asked for
`expression`, so every one of them was written by hand instead — which is exactly
the copy this library exists to delete.

**Why this does not contradict the manual, and where it bends it.** The manual
grants the empty state its face; it does not say that every region labelled
«nothing here» is an empty state. Its sentence about the admin — «no faces except
empty states» — is a limit on WHERE a face may appear on that surface, and it was
written imagining the empty state as an event on a screen. Twelve of them at once
was not the picture. The design system's line is the one that genuinely bends:
it describes one empty state, and now there are two.

The rule the manual is protecting survives intact, and it is the one that
matters: **the humour lives where the reader has stopped evaluating you.** A face
in a table row is not humour, it is a mascot in a spreadsheet.

**Why a union and not an optional `expression`.** The backlog offered both and
the optional prop is the smaller change. It is also the one that fails: an
optional face puts the decision back at every call site, and «decided at every
call site» is what produced 37 hand-written empty states and a `faceUsage` table
nobody was reading. With the union, `variant="inline"` does not accept
`expression` at all — the wrong thing is not a mistake you can make, which is the
same reason `TalkCardProps` is a union.

`page` is the default, so every call site written before this keeps its face and
nothing breaks.

**Why `inline` draws no box.** Every project invented the same one — a dashed
border with a small glyph — and it is not in the system. Two reasons it stays
out. A dashed stroke appears nowhere else, and «it looks better» is not an
argument this repo takes. And the placement makes it redundant: `inline` goes
inside a `Card` or a `Table` cell, both of which already draw the region, so a
second border is noise and a second border in a different stroke is a second
idiom. What makes it quiet is the muted tone and the absence of a surface — not a
smaller size. The type comes from the same scale as `page`, one step down.

The glyph is an `icon?: ReactNode` the project passes and sizes, at 1em and in
`currentColor`, exactly like `Stat`'s. The system still has no icon library.

**A collateral in ESLint.** `no-unused-vars` gains `ignoreRestSiblings: true`.
`const { variant, ...rest } = props` is how a prop is kept OUT of the spread, and
«`...props` is spread» is a rule of the component pattern: a variant that reaches
the DOM is an unknown attribute and a React warning. Without the option the only
way to strip one is a cast, which re-adds every prop the signature just took out.

**A collateral in the stories.** `Where the faces go` was teaching `annoyed` for
the 404 and `confused` for the server error — swapped against `faceUsage` — and
`hearts` for a completed course, where the data says `shades`. The story right
above it says the data exists «so the choice is not made by eye at every call
site». It was being made by eye one story later, in the published Storybook.

**Action in the document:** add the second shape to the design system's empty
state line — «hueco de tabla o widget · sin cara, sin superficie, glifo opcional
del proyecto + línea 15px muted». The brand manual needs no change: its rule is
about where a face may appear, and this adds no place.

---
