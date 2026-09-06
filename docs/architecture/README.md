# Architecture

**What the system IS.** These two are the consultable copy of the Claude Design
canvases — the source of the values the code implements, and the thing the code
is measured against.

| File | What it holds |
| --- | --- |
| [`design-system.md`](design-system.md) | The palette, the scales, the spacing, the states, the motion rule |
| [`brand-manual.md`](brand-manual.md) | The mark, the isotype, Tiburoncín and his dosage by surface |

## The one rule that matters here

**The canvases are the source; these files are a copy.** They are not edited to
match the code. When the code and one of them disagree, the discrepancy is
recorded in [`../decisions/`](../decisions/README.md) with what there was, what
stayed and why — and most of those entries end in an **action** somebody has to
carry back up to the canvas.

That direction is not a formality. The library exists because five projects each
wrote the same pieces and drifted apart, and the highlighting palette lived for
months with the wrong colour because the identity document was not greppable from
the code. A copy that quietly edits itself to agree with the code is the same
failure with better manners.

`pnpm check:decisions` prints the actions still outstanding. It cannot check
whether they were done: the canvas lives outside this repo.
