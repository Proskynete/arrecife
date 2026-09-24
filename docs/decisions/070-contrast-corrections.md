# § 70 · Three colours moved a few points of lightness, and only the README said so

**Release:** 0.12.3 · [index](README.md)

---

**System rule:** the Design System canvas draws the form error in `#E05252`
(eleven times) and light muted text in `#6B7480`. The warning colour in light
mode was `#9A6A12`.

**What there was:** the identity document measured every colour against
`background`. `surfaceRaised` is the worst surface in both modes — darker than
the page in light, lighter in dark — and it is where menus and active tabs live.
Three values did not reach AA where they are used, so the code moved them:

| token | canvas | code | reason |
| --- | --- | --- | --- |
| `light.textMuted` | `#6B7480` | `#626A75` | 4.24 over paper, under AA |
| `light.warning` | `#9A6A12` | `#8D6111` | 4.23 over paper, under AA |
| `dark.error` | `#E05252` | `#E15757` | 4.35 over `surface`, where a form error sits |

Hue and saturation are the same; only lightness moves, by one to four points.
This was written down in the README («Contrast corrections») and in the header of
`tokens.ts`, and never here — so no action ever reached the canvas, which kept
drawing the old three.

**What it is now:** the code values. This entry is the record the README section
should have had.

**Why:** the decision log is the one place `pnpm check:decisions` reads. A
correction recorded anywhere else is a correction the canvas will never hear of.

**Action in the document:** none. Applied on the Design System canvas on 24 Sep
2026: it draws `#E15757` and `#626A75`, and no `#E05252` or `#6B7480` is left.
