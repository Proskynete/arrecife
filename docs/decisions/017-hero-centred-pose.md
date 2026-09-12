# § 17 · The hero's pose CAN be centred, on a page that is only that

**Release:** 0.6.0 · [index](README.md)

---

**Document and code, until now:** «the pose bleeds off the bottom-right corner,
NEVER centred. A centred mascot under a headline is a cover illustration, and
this is a header».

**What stayed:** the rule is still the default — `variant="header"` — and
`variant="centered"` is added alongside it.

The rule was written against the hero of a page with more content below it, and
there it is correct. `links` is not that page: it is centred end to end, it has
nothing else, and the mascot is the protagonist and not the flourish. That
project was not arguing with the rule, **it was skipping `Hero` entirely**, which
is the worst possible outcome: it ended up with a copy of the gradient in another
repository, which is exactly the kind of drift this library exists because of.

A rule with a name can be argued with; a copy cannot. The variant puts the pose
ABOVE the headline and not below it, which is what keeps it out of the case the
rule forbids: it does not close a block of text, it heads one.

**Action in the document:** note the exception and its condition — a full page,
with no content after it — not the variant on its own.

---
