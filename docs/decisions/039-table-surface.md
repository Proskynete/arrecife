# § 39 · The table carries its own surface

**Release:** 0.8.0 · [index](README.md)

---

**System rule:** the library ships pieces, and the page composes them. A table
was a piece and its frame was the page's business.

**What stayed:** `Table` draws `rounded-card`, `border-hairline` and the clip.
The wrapper every project wrote goes away.

**It was one omission showing up as two.** `TableRow` tints a `<tr>` on hover and
a `<tr>` is a rectangle. Nothing clipped it, so the tint of the header row and of
the last row spilled out through the rounded corner of whatever `rounded-xl
border` the project had wrapped the table in. The fix from outside is one class —
`overflow-hidden` on that wrapper — and it worked exactly as far as somebody
remembering it: the five tables of the `cursos` panel had it and the nine of
`blog-content-manager` did not.

The second half is the wrapper itself. Fourteen call sites across two projects
wrote the same `rounded-lg border border-border bg-card overflow-hidden`, which is
a card surface spelled out fourteen times in shadcn's vocabulary instead of
imported once in ours.

**The clip is free.** An element with `overflow-x: auto` already clips its content
to the border box, corners included, and the container has scrolled horizontally
since the beginning so the PAGE would not. Adding the radius and the border to
that same element is the whole change; there is no second wrapper and no
`overflow-hidden`.

**There is no background token on it**, and that is the part that is easy to get
wrong. `CARD_SURFACE` is `rounded-card border-hairline bg-surface border`, and
reaching for it here would have painted the container `surface` — which is
exactly the tint `TableRow`'s hover uses. The hover would have become invisible
against the surface it lifts off. The table sits on the page; the row lifts off
the page.

**The alternative, and why not.** Rounding the first and last cell of `TableRow`
fixes the spill and leaves the fourteen copies where they are. It is the smaller
change and it solves the smaller half.

**And it found a real one on the way in.** The first story with more columns than
width failed axe on `scrollable-region-focusable`, and the bug was not new: the
container has scrolled horizontally since the beginning, a region you can pan
with a mouse has to be reachable with a keyboard — WCAG 2.1.1 — and a table of
text holds nothing focusable to land on. Every table in the system has been
unreadable past its right edge for a keyboard user, and no story had ever been
narrow enough to say so. The container takes `tabIndex={0}` and the focus ring.

It is unconditional, and the alternative is what settles it: whether a table
overflows depends on the viewport, so setting this correctly at render means
measuring in an effect and re-measuring on resize — a ResizeObserver on every
table in the system, to avoid a tab stop. A stop that scrolls nothing is a small
cost. A region a keyboard cannot reach is content that is not there.

**What it costs.** It is a breaking visual change: a project that keeps its own
wrapper gets two borders. That is a line to delete per call site, it is visible
the moment the page is opened, and `../runbooks/migration-0.8.md` says so. `className`
reaches the `<table>` and not the container — the same trap `Nav`'s `size`
documents — so there is no opting out from the call site. One shape, because
fourteen call sites wanted the same one; a second gets a prop when a second
consumer exists.

**Action in the document:** add the surface to the table's specification. It is
now a panel and not a grid, and the border it draws is the card's hairline. Note
that the scroll container is a focus stop.

---
