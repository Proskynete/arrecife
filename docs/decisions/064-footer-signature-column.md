# § 64 · The signature is a column of its own, and the credit stops measuring the icons

**Release:** 0.12.1 · [index](README.md)

---

**System rule:** none. Neither canvas draws the footer with a credit line under
the signature — that shape is [§ 62](062-footer-built-with.md)'s, made here — so
there is no rule for its spacing to disagree with.

**What the code did**, and it is two faults that look like one:

The block that holds the signature and the credit separated them with
`gap-step-xs`. That is 8px, the page's smallest step, and a step is what goes
between things that are not the same thing. Between two lines of 13px mono it is
a whole extra line of air: rendered, the credit does not read as the signature's
second line, it reads as a stray paragraph that happened to land under it. The
two lines were put together precisely so they would not read that way — § 62
moved the credit out of the footer's bottom edge for exactly this — and the gap
was undoing the move.

And in the default shape the signature lived INSIDE the first row. The rows were
assembled so it could be dropped into whichever one existed — brand if there was
one, the social icons otherwise — and the comment on that assembly said what it
was for: «the difference between the signature goes on the right and the
signature goes at the top right».

Those two sentences are the same sentence only while the signature is one line.
`builtWith` makes it two, the row is a flex row and grows to hold the taller
item, and the social icons below it move down 22px. A line about what built the
page had lengthened a row about where to find its author.

**What it is now:**

- The block has NO gap. Two lines of the same size and the same voice are
  separated by their leading, which at `meta`'s 1.6 already carries 8px of it,
  and by nothing else.
- The default shape is two columns from `sm` up. The rows — brand, then icons —
  stack down the left; the signature and its credit hang from the top right.
  Neither column measures the other, so the credit lands beside the icons
  instead of above them and the footer is exactly as tall as it was without it.

**Why the row alignment changed with it.** The single row carried `items-center`,
and the reason was written down: a 13px line centred against a 28px brand rather
than floating at its top. Against a COLUMN that reason inverts — centring the
signature between the brand and the icons puts it level with neither, which is
the floating the original note was avoiding. So `sm:items-start`, and the
signature goes back to the corner the rule always named. What it gives up
against the brand is the half-line `items-center` was worth.

**What changes on a phone, and it is the one thing a consumer will see.** Below
`sm` the footer is one centred column, which is [§ 53](053-footer-centred-phone.md)
and stays. The order inside it changes: brand, icons, signature — the signature
closes the stack instead of sitting between the two. It is not a preference, it
falls out of the structure: the signature is beside the rows now, not inside the
first one, and a column has nowhere else to put it. It is also where a signature
goes at the foot of a phone screen, and it is where `full` has always put it.

The rhythm of that column is now one step throughout — `step-lg` between all
three — where before the brand and the signature were a `step-md` apart and the
icons a `step-lg` below. One gap for one column.

**Why not align the credit with the icons instead**, which is the other way to
stop the push and the one most footers on the web draw: signature level with the
brand, credit level with the icons, each right-hand line answering a left-hand
row. It was tried in the browser and it is the same fault as the 8px gap with a
bigger number — the two lines end up a `step-lg` apart, the credit stops
belonging to the signature, and § 62's placement is lost to fix a spacing bug.
The pair stays a pair; it is the pair that moves.

**Nothing changes for a footer that does not pass `builtWith`.** The signature
sits where it sat, half a line higher on a wide screen and last instead of
second on a narrow one. `full` is untouched but for the gap: its signature has
always closed the footer on its own row, which is where the default shape's
problem does not exist and is why [§ 47](047-footer-columns.md) put it there.

**Action in the document:** none. The credit line is not in the manual to begin
with — § 62 left an action open for it — and when that line is written it should
say the credit is the signature's second line, with no space between them beyond
the leading.
