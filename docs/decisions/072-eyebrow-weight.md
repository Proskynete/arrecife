# § 72 · The eyebrow is 400, because the two canvases disagree and the code picked one

**Release:** 0.12.3 · [index](README.md)

---

**System rule:** Manual § 07 lists «eyebrow JetBrains 12px 500 0.10–0.14em». The
Design System canvas draws every eyebrow at 400.

**What there was:** two documents, two weights, and a token that says neither:
`typeScale.eyebrow` has no `weight`, so it renders at the mono's 400.

**What it is now:** 400, which is what the Design System draws and what every
consuming site renders today. Tracking stays 0.12em, inside the
manual's range.

**Why:** at 12px uppercase with 0.12em tracking, 500 in JetBrains Mono reads as
bold against the Geist around it, and the eyebrow's job is to sit above the
headline, not to compete with it. The Design System is the drawing that was
checked at size.

**Action in the document:** none. Applied on the Manual canvas on 24 Sep 2026:
«eyebrow JetBrains 12px 400 0.12em».
