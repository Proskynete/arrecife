# § 20 · The accordion DOES animate its height

**Release:** 0.6.0 · [index](README.md)

---

**System rule:** «no entrance animations». Mistake nº 3 on `AGENTS.md`'s list is
literally «adding an entrance animation because it looks better».

**What there was:** `Accordion` landed in 0.4.0 unanimated, citing that rule, and
noting that Radix publishes `--radix-accordion-content-height` precisely to
animate it and that it was not being used here.

**What stayed:** the height is animated, behind `motion-safe`, with
`--duration-standard` and `--ease-standard`.

The argument that changed the decision is not aesthetic. In a disclosure
**nothing appears**: a gap opens, and everything below the accordion shifts.
Without a transition that shift is a jump of one or two hundred pixels, and
whoever just clicked loses their place on the page — which is exactly the harm
the «no movement» rule exists to prevent. Applying it here turned it against its
own reason.

It is the same category as the second exception, the side panel: «a panel
entering from an edge slides by definition». A disclosure that reveals content
pushes what is below it by definition.

It introduces neither a new timing nor a new curve, and `motion-safe` turns it
off for anyone who asked for less motion: there the panel still appears where it
will stay.

With this one there are **four** declared exceptions: the button spinner, the
side panel, the skeleton shimmer and the accordion. All four are feedback about
PROGRESS or about spatial continuity; none of them is decoration.

**Action in the document:** note the fourth exception alongside the other three.

---
