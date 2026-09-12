# § 31 · The neutral number stops being biolume, and the tone moves to the badge

**Release:** 0.7.0 · [index](README.md)

---

**Document:** `../architecture/design-system.md` — «biolume para lo neutro y arena SOLO
cuando el número es el problema».
**Code:** a neutral number is primary ink. Sand still paints the number for
`alert` and `achievement`; biolume moved to the icon badge and the sparkline.

**What changed underneath the rule.** That sentence was written for a card with a
number and a label in it — which is what `Stat` was. It now also has an icon
badge and a sparkline, and both of them carry the tone. A biolume number on top
of a biolume badge and a biolume line is the third accent in a card the size of a
postcard, and the thing you came to read stops being the loudest thing in it.

**The half of the rule that matters survives untouched.** `alert` and
`achievement` still paint the NUMBER sand, so sand still means «this number is
not just a number» — the problem, or the reward. What moved is only the neutral
case, and neutral had no meaning to carry: it was biolume because the card had
nowhere else to put the brand colour.

Primary ink is also the best contrast in the card by a distance, and the figure is
the one thing in it that is always read.

**The icon is a badge in the opposite corner**, not a glyph before the title.
That is not decoration either: in a panel row the eyebrow is a different length
in every card, so an inline icon puts the only coloured mark on a different x
each time. Pinned to the corner it lands on a grid, and the row reads as a row.

**The circle is the tint pattern the system already has.** `bg-accent/10` is a
SURFACE and the colour stays on the glyph — that is § 4b, and it is also what
keeps it legal: a glyph is a graphical object at 3:1, where accent over its own
tint does not clear text's 4.5. Nothing new was measured because nothing new was
invented.

**The sparkline is `mt-auto`.** In a grid the cards stretch to the tallest, and a
line that sits wherever the standfirst happens to end turns a row of ten into a
sawtooth. Pinned to the bottom edge of the padding box, the lines share a
baseline across the row.

**Action in the document:** update the `Stat` line — «el número en tinta primaria;
biolume va en el badge del icono y en la sparkline · arena en el número para
`alert` y `achievement`».

---
