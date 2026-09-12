# § 18 · The chart series palette is not in the document

**Release:** 0.6.0 · [index](README.md)

---

**Document:** it says nothing. There are no charts in the canvases.

**What stayed:** `tokens.series`, four colors per mode, none of them new.

`cursos` draws metrics with Recharts, and with no token every chart picks its own
colors: it is the highlighting palette failure again, under another name. The
alternative — not putting charts in the library — leaves the problem standing,
because the project is going to draw them anyway.

The four are biolume, sand, `brand.body` and plankton. Three decisions behind
them:

- **Four, not five and not seven.** It is the same criterion as the syntax
  palette, which is also four on purpose: the system communicates with color and
  border, not with chromatic noise. `seriesColor` wraps around past the fourth,
  and two series sharing a color is the correct signal — there are too many
  categories.
- **They are told apart by hue, not by lightness.** Teal, orange, blue and grey.
  Biolume and `success` would have given two nearly identical greens in light
  mode, and two indistinguishable series for anyone who cannot separate red from
  green.
- **`brand.body` belongs here and not in the highlighting**, by the same rule read
  the right way round: the system restricts it to fill and never to text, and a
  chart series is fill. In the highlighting it measured 4.2:1 and stayed out.

The threshold that applies is the graphical-object one, 3:1 against the
background, not the text one. The worst of the eight values is `brand.body` over
paper, 3.9:1.

**Action in the document:** add the series palette and the four-color rule.

---
