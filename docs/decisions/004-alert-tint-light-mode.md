# § 4 · The alert tint in light mode

**Release:** 0.6.0 · [index](README.md)

---

**Document:** «background at 8 % of the semantic color, border at 22 %»,
calculated over abyss. The audit suspected that over paper the 8 % would be
invisible and that a second table would be needed for light mode.

**Measured.** Contrast of the tint against the page background:

| tone | 8 % dark | 8 % light |
|---|---|---|
| accent | 1.149 | 1.106 |
| success | 1.116 | 1.121 |
| warning | 1.126 | 1.109 |
| error | **1.067** | 1.120 |

Light mode does **not** need a second table: it holds up as well as or better
than dark across all four tones. The suspicion ran the other way round.

The system's only weak point is `error` over abyss, 1.067, the faintest of the
eight tints, which leans entirely on the 22 % border.

**Action in the document:** note that the 8/22 recipe holds in both modes, and
that dark `error` is the edge case.

---
