# § 37 · The focus ring is one utility, at the offset the document actually gives

**Release:** 0.7.0 · [index](README.md)

---

**Document:** «focus ring 2px #35D6C0 + offset 3px», given once, on the primary
button.
**Code, until now:** `focus-visible:outline-2 focus-visible:outline-offset-2
focus-visible:outline-accent`, copied verbatim to twenty-eight call sites in
twenty-four files. Offset **2**, everywhere.

**Nobody decided on 2.** That is the entire finding. There is no entry arguing it
down from 3, no contrast measurement behind it and no note anywhere — the first
component was written at 2 and the next twenty-seven were written by copying the
first. Three consecutive audits reported it and it did not move, because «change
the focus ring» meant twenty-eight edits that had to agree, which is the shape of
a task that stays on a list.

**It is one utility for the reason § 15 already gives.** A list kept in sync by
hand with another list ends up out of sync; twenty-eight copies are twenty-eight
chances to write the twenty-ninth at offset 2 again, and nothing was comparing
them to anything. `focus-ring` lives in `build-tokens.mjs` beside
`transition-standard`, and `scripts/theme-css.test.mjs` asserts what it compiles
to — including that it is `outline-offset: 3px` and not 2, which is the assertion
that did not exist for three revisions.

**The conversion button is the one that changes colour**, and this is the half
that is an interpretation rather than a transcription. The document specifies the
ring once, on the primary button, in biolume; it does not say what happens on the
sand one, and the canvas's own drawing of it does not survive the extraction into
`../architecture/design-system.md` — the SVGs come out as «SVG». `conversion` is the system's
only sand fill — «Solo un botón arena por pantalla» — and a biolume ring three
pixels off a sand button puts both of the brand's accents inside the same glance,
which is the one place in the system where they meet with nothing between them.
`focus-ring-warm` sets **only** the colour, so the width and the offset stay in
one place and cannot drift apart.

Two things make it safe to take rather than defer. It changes no contrast
obligation: at offset 3 the ring sits on the page background, not on the button,
so both colours are measured against the same surface they already pass against.
And it is one class in one variant — if the canvas turns out to show a biolume
ring on the sand button, deleting `focus-ring-warm` from `button.ts` is the whole
revert.

**`avatar.tsx` keeps its classes written out.** Its focus lives on a hidden input
and the ring is drawn by the label through `has-[:focus-visible]:`, which is a
different selector from the one the utility nests. It moved to offset 3 with the
rest; it is the known outlier and it is one site, not twenty-eight.

**Action in the document:** none. The offset is a correction TO the code — the
document was right and had been right for three revisions. The sand ring is the
one thing that needs ratifying: confirm it, or say the ring is biolume on every
variant and `focus-ring-warm` comes out.

---
