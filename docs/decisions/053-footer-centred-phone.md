# § 53 · The footer is centred on a phone, and `links` knew first

**Release:** 0.10.0 · [index](README.md)

---

**System rule:** the footer is a stacked block with the signature pushed to the
right of the first row.

**What the code did:** the default shape was one `flex flex-wrap items-center`
row at every width, with `ml-auto` on the signature. `variant="full"` stacked its
two blocks below `md` and left both flush left.

**What was wrong with it.** `flex-wrap` does the first half of the job on a phone:
the signature drops onto a line of its own because there is no room for it beside
the brand. `ml-auto` then keeps pushing, so it sits flush RIGHT on a line of its
own, at the bottom of a page whose every other element is centred. It reads as an
element that escaped rather than as one that was placed.

**How it was found:** it was not. `links` has shipped the answer in production
since before this library had a `Footer`, in a file whose whole purpose is to be
a replica of it — `flex-col items-center sm:flex-row`, `justify-center
sm:justify-start` on the icon row, `sm:ml-auto` on the signature — and its own
docstring lists it as one of three deliberate departures. It was the library that
was diverging.

**What it is now:** exactly those classes. Below `sm` the default shape is a
centred column; from `sm` up it is the row it always was. `variant="full"` centres
its brand block and its link columns below `md`, and its column grid starts at one
column instead of two.

**Why `sm` for one shape and `md` for the other.** The cut goes where the layout
stops being a single column. In the default shape that is `sm`, where the brand
and the signature share a line; in `full` it is `md`, where the link columns sit
down beside the brand block. Using one breakpoint for both would centre a block
that already has something to align against.

**Action in the document:** none. The footer section describes the wide layout and
says nothing about a narrow one, so nothing there is contradicted — what is added
is a case it never covered.
