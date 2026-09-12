# § 4b · The text over the tint cannot be the tint's color

**Release:** 0.6.0 · [index](README.md)

---

**Found while implementing point 4**, not in the audit. The accessibility suite
in light mode took it down in five stories.

The alert's title and the status badge's text were in the semantic color, on top
of a background at 8 % of that same color. In light mode that can never pass AA:
the light semantics are calibrated to pass **just** over paper, so tinting the
background with them sinks them below 4.5.

| tone | over paper | over its own 8 % tint | `textPrimary` over the tint |
|---|---|---|---|
| accent | 4.55 | **4.12** | 14.82 |
| warm | 4.54 | **4.11** | 14.85 |
| success | 5.80 | 5.17 | 14.63 |
| warning | 4.88 | **4.40** | 14.78 |
| error | 4.87 | **4.35** | 14.64 |

No alpha fixes it: the problem is putting the color on top of itself.

**Resolution:** the tint is a **surface**, so the text on top of it is a text
token. The alert's title goes in `textPrimary` and the semantic color stays where
it is not text — the border and the glyph — which is all the document ever asked
of it. The glyph is decorative and `aria-hidden`, so the 3:1 threshold applies to
it and not 4.5.

The status badge, on top of that, carries a **solid** border instead of the
alert's 22 %: at 13px and two words wide, the border is the only thing saying
which tone it is, and at 22 % it did not get there.

**Action in the document:** note that a semantic color is not a text color over
its own tint, in either mode.

---
