# § 19 · The reading progress bar is not a progress bar

**Release:** 0.6.0 · [index](README.md)

---

**What stayed:** `ScrollingProgressBar` is `aria-hidden` and has no
`role="progressbar"`.

`Progress` measures a task: there is a total, somebody started it and it is going
to finish. The reading bar measures a POSITION in a document, which is travelled
in both directions and of which there is nothing to complete. Announcing «37 %»
to somebody who already knows where they are in the document is noise, not
information.

It is the opposite decision to `ChartContainer`'s, and it is worth seeing why
they do not contradict each other. There too `aria-hidden` was tried, with the
same argument — «each tick does not tell what the chart tells» — and it was
wrong: the chart **is** the content and it also contains focusable elements, so
hiding it puts focus into something that does not exist for whoever is listening.
The reading bar is not content and has nothing focusable inside it. The suite is
the proof: the version with `aria-hidden` on the chart container took down three
stories with `aria-hidden-focus`.

**Action in the document:** none.

---
