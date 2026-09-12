# § 38 · The hero's year count is not unknown, and it is still not a token

**Release:** 0.7.0 · [index](README.md)

---

**Proposed copy, in the canvas:** «[X] años construyendo plataformas y los
equipos que las sostienen».
**Status:** the number is in the brand manual, and it does not become a token.

**It was never unknown.** `../architecture/brand-manual.md` § 08 · Voz y tono opens with
«**Diez** años de industria hablando en primera persona, sin distancia y sin
pose». That is the identity document answering its own question — the copy is
blocked on a number that the manual states in the section about how the voice
works. It is exactly the class of thing this repo exists to stop: a fact that
lives in a canvas nobody greps, so it gets asked again instead of read.

So the deck is unblocked at **ten**, and it does not need inventing.

**And it does NOT go in `tokens.ts`**, which is the part worth writing down,
because everything about the shape of this repo says it should. `tagline` and
`naming` are there for a reason `logo.tsx` states plainly — «a tagline
hand-written across five projects is five taglines» — and a year count drifting
between a hero, a CV and a LinkedIn bio is the identical failure.

It stays out because both ways of putting it there are worse than not having it:

- **A literal `years: 10` expires in silence.** It is correct until a January and
  wrong from then on, with nothing that fails and no one who notices — which is
  the same failure as the highlighting palette that sat on the wrong colour for
  months, the one this whole library was built to prevent.
- **A derived `new Date().getFullYear() - since` makes the token
  non-deterministic**, and `src/tokens/` is the one place in the repo that cannot
  afford that. It is consumed by Satori for the OG images and read by
  `build-tokens.mjs` at build time: a token whose value depends on the clock
  produces a `theme.css` that differs between two builds of the same commit.

The third option — store the starting year and derive at the call site — needs a
starting year, and the manual gives a rounded count and not a date. **Ten years
stated in August 2026 is 2015 or it is 2016**, and picking one is inventing the
thing this entry exists to say was not invented.

**Action in the document:** give the manual a start year beside «Diez años», or
say the count is rounded on purpose. With a year, `since` becomes a token and the
count is derived by whoever renders it. Without one, the copy still ships — it
just ships as copy.

---
