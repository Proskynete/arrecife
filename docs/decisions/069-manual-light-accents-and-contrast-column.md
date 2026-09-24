# § 69 · The manual's light accents fail AA, and its contrast column measures against two surfaces

**Release:** unreleased · [index](README.md)

---

**System rule:** Manual § 06, the light-mode rows, prints «bioluz oscura
#0F8F80 · Links y foco sobre papel · 4.6:1» and «arena oscura #B4632A · Etiquetas
y citas sobre papel · 4.8:1». The dark rows print a contrast column: espuma
16.9:1, bruma 8.9:1, plancton 4.9:1, bioluz 10.7:1, arena 9.4:1, tiburón 4.3:1.

**What there was:** measured with the WCAG formula, the two light accents do not
say what the manual says:

| hex | over paper `#F6F2EA` | manual says |
| --- | --- | --- |
| `#0F8F80` | 3.57:1 | 4.6:1 |
| `#B4632A` | 3.95:1 | 4.8:1 |

Both fail AA for text. The code never shipped them: `light.accent` is `#0D7C6F`
(4.55:1 over paper) and `light.warm` is `#A65B27` (4.54:1), and the Design System
canvas already draws those two. Only the manual is behind, and it is the document
a designer opens first.

The dark column is not wrong so much as unlabelled. Measured over abismo
`#091319`, which is the page, the six read 16.84, 9.50, 5.57, 10.31, 9.28 and
4.22. The manual's plancton 4.9 is its contrast over fosa `#10202B` (4.93), and
bruma's 8.9 matches neither surface. A column that mixes surfaces cannot be
checked by anybody.

**What it is now:** the code stays. `#0D7C6F` and `#A65B27` are the light
accents, and every ratio in the palette is stated against the page it sits on.

**Why:** a contrast figure is a promise to whoever uses the colour. Publishing
3.57 as 4.6 is the one kind of drift this repo cannot absorb in silence, because
the next project to read the manual would pick the failing hex with a clear
conscience.

**Action in the document:** in the Manual canvas § 06 · Color, replace the two
light rows with «bioluz oscura #0D7C6F · Links y foco sobre papel · 4.55:1» and
«arena oscura #A65B27 · Etiquetas y citas sobre papel · 4.54:1». In the dark
table, change the contrast column to 16.8 / 9.5 / 5.6 / 10.3 / 9.3 / 4.2 and put
«contraste sobre abismo» in the column header.
