# § 55 · The toast's tone is a surface, not a hairline

**Release:** 0.10.0 · [index](README.md)

---

**System rule:** a semantic colour is carried as a tint plus a border, and the
text over it is a text token. That is [§ 4b](004b-text-over-tint.md), argued for `Alert`.

**What the code did:** all three toast variants were `bg-surface`, and the whole
difference between a confirmation and a failure was `border-success/40` against
`border-error/40`. No mark, and the body in `textSecondary`.

**What was wrong with it.** Two hairlines at 40 % opacity, on a box that appears
in a corner for five seconds over content it did not choose. At the size and the
dwell time a toast actually has, that is not a colour — it is two greys, and
whether the thing worked is exactly what a toast exists to say.

**What it is now:** the recipe `Alert` already carries at `emphasis="strong"` —
the semantic colour solid on the border and at 10 % as a tint — plus
`CheckCircle` and `WarningCircle` in the semantic colour. `neutral` gets neither:
a toast with no tone is a receipt, and a glyph on it says nothing the sentence
does not.

**Why `strong` and not the subtle 8 %/22 %.** `strong` exists for the alert that
has to read UNDER a form field. A toast has the same problem from the other side:
it reads OVER content it did not choose, so it cannot lean on the page around it
being quiet.

**The one odd line, written down because it will look like a mistake.** The tint
rides on a flat `linear-gradient` and not on `background-color`. A toast has to be
opaque — it floats — so `bg-success/10` alone would let the article underneath
show through. `bg-surface` paints the opaque ground and the gradient paints the
tint over it, in one element, with no wrapper and no `::before` needing a stacking
context of its own. The two colour stops are identical on purpose: it is a fill.

**Why `WarningCircle` and not `XCircle` for the error**, which is what `Alert`
uses. The toast's own close button is a `✕` two centimetres away, and a `✕` mark
beside it reads as a second one.

**Action in the document:** the toast section gives a border and no fill. Bring it
in line with the alert's `strong` recipe and add the two marks, or say why a
notice that floats should carry less colour than one that sits in the page — the
current specification implies the second and the reason is not written anywhere.
