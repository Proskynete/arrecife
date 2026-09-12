# § 36 · Two actions on the document that were never carried over

**Release:** 0.7.0 · [index](README.md)

---

Not a discrepancy between code and document: a discrepancy between a decision and
its own action. Both are recorded here because they were found in an audit rather
than by anyone reading the entry that asked for them, which is the point.

**§ 22 asked for a row and never got it.** The entry closes with «Action in the
document: add `icon-sm 32×32` to the controls table». The code has had it since:
it is in `tokens.control.iconSm`, in `buttonVariants` and in the generated props
table. The canvas still lists four sizes — «sm 8/14 · md 12/22 · lg 15/30 · icono
42×42» — so a reader who trusts the document and builds an admin toolbar reaches
for 42 and gets the row height the size exists to avoid.

**§ 29's icon line is still pending too**, and § 35 above has now added a second
half to it before the first half was ever written down.

**Why they are not fixed here.** `../architecture/design-system.md` is a **verbatim**
transcription of the canvas, and its own header says translating or editing it
would break the one property it exists for: that a drift like the Shiki theme's
`#E05252` can be caught by grepping the copy against the source. Editing the copy
to match the code inverts that — the next drift would be invisible because the
copy would already agree. **The canvas is the source, so the canvas is where
these two go**, and the transcription is re-extracted afterwards.

**The durable half of the fix is a script, and it is in this change.** Every
entry ends in «Action in the document» — that is what § 8 and § 15 were fixed
for — and **most of them are still asking for a change to a canvas**, with
nothing anywhere that listed them. An action was only as durable as whoever last
read the entry it was buried in, and § 22's sat in the middle of this file for
thirteen entries.
`pnpm check:decisions` collects the lines and prints them.

**It reports, it does not enforce**, and that is not a compromise: the actions
land on a canvas the script cannot open, so it can say what is outstanding and it
cannot say whether it was done. It exits 0 on the list. The one thing it DOES
fail on is its own contract — an entry with no action line at all — because the
line exists to force the question «and what does the document have to say now»,
and «none» is a valid answer that still has to be written down. **It found three
on its first run**: § 8, § 15 and this entry, all of which had simply ended
without asking. That is the same class of gap it was built for, one level up.

**Action in the document:** none. Both actions above belong to § 22 and § 29 and
are listed under those; this entry is the record that they were dropped, not a
new request.

---
