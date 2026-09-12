# § 32 · The sidebar gets blocks, and the icon replaces the prompt

**Release:** 0.7.0 · **Status:** Reversed in § 48 · [index](README.md)

---

**Document:** `../architecture/brand-manual.md` § 09 gives the admin its dosage — «Solo la
aleta. Sin caras salvo estados vacíos» — and says nothing about how its
navigation is structured.
**Code:** `SidebarGroup`, an `icon` on `SidebarItem`, and a `brand` slot on
`SidebarNav`.

**What forced it.** `SidebarNav` was built for a blog admin with four sections.
The course admin has eleven, in three natural blocks — content, students, sales —
and eleven flat items is where a sidebar stops being readable. The fix for that
is not a scrollbar, it is saying what the blocks are.

**The icon REPLACES the `▸` and does not join it.** Two marks before a label is
one more than the eye needs. The prompt is there to say «this is a place you can
go», and a section glyph says the same thing better — so where there is a glyph
the prompt has no job left. A sidebar with no icons keeps it, which is the
reading sites' case and the reason it is not simply deleted.

**The group label is a paragraph and not a heading**, which is the only part of
this with an accessibility argument. A sidebar is navigation, not content: a
heading here lands in the page's document outline between the page's own, and a
screen-reader user walking headings ends up in the furniture. What the label does
instead is name a nested list through `aria-labelledby`, so the announcement is
«lista Ventas, 3 elementos» rather than one list of eleven.

**`brand` does not replace `title`.** `title` is the eyebrow AND the `<nav>`'s
accessible name when it is a string; a logo is not an accessible name, so a panel
that uses `brand` passes `aria-label` instead. The slot carries what is actually
shared — the rhythm and the hairline under it — and leaves the wordmark to the
project, because every panel spells its own name differently.

**Action in the document:** none. Nothing about the mascot's dosage, the colours
or the type changes; this is structure the document never described.

---
