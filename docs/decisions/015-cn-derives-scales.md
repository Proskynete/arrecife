# § 15 · `cn` derives the scales, it no longer repeats them

**Release:** 0.6.0 · [index](README.md)

---

This is not a divergence from the document: it is a bug that `cn.ts` itself had
predicted and that came true.

`tailwind-merge` does not know Arrecife's scale, and `text-` is ambiguous between
size and color. Undeclared, `text-tag` looks like a COLOR, so in
`cn('text-tag', 'text-text-primary')` the last one wins and the size disappears:
the class stays written in the component and never reaches the DOM.

`cn.ts` maintained the list «by hand and on purpose», and it drifted within a
single session: `stat`, `meta`, `tag`, `chip` and `lead` went into `typeScale`
and not into that list. All five were being dropped in any piece that also asked
for a tone — which is nearly all of them. **The badges rendered at an inherited
16px instead of 12.5**, and `ArticleCard`'s metadata line had been broken since
it moved to `meta`.

Same story with `px-control-*`: not being in the `px` group, it did not conflict
with the tertiary's `px-0` and the CSS order won rather than the intent.

The groups are now derived from `tokens.ts` with `Object.keys`. Adding a step can
no longer be forgotten here, because there is nothing to add here.

**Lesson, and it goes to the team's document before the design one:** a list that
has to be kept in sync by hand with another list ends up out of sync. If it can
be derived, derive it.

**Action in the document:** none. It is an implementation decision and it changes
nothing anyone reads on a canvas.

---
