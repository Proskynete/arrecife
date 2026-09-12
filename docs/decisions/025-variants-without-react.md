# § 25 · Projects without React are served by `./variants`

**Release:** 0.6.0 · [index](README.md)

---

**Backlog point 12** asked for a way out for `links`, which ships no framework
JavaScript and was replicating `LinkRow` and `Footer` in Astro by copying the
class vocabulary. Two options were on the table: export the class strings as
constants, or publish a framework-free subpackage.

**What stayed:** the first one, and only for the classes that carry identity.
`./variants` publishes `buttonVariants`, `badgeVariants`,
`categoryBadgeVariants`, `textVariants`, `alertVariants`, `avatarVariants`,
`CARD`, `CARD_SURFACE` and `CARD_HOVER`, with no React.

**What is deliberately NOT in it:** the layout classes of each component —
`px-step-md py-step-sm`, `max-w-wide`, `gap-[18px]`. Those are what `links` still
copies, and copying them is fine. What drifts is identity: color, radius,
gradient, hover. That is what happened the one time it did drift — the hero
gradient sat at `55%` and `#e9eeea` against the token's `60%` and `#EFE9DE` — and
all of it is importable now.

Pulling the layout out too would mean a second list of constants kept in step
with the component by hand, with nothing verifying they match. That is § 15
exactly, and § 15 is the entry that says a list maintained by hand against
another list ends up out of sync.

**Per-component subpaths** — `@eduardoalvarez/arrecife/link-row` and company —
stay unbuilt. They solve a different problem, the one the backlog measured when
`ScrollingProgressBar` added 332 KB by being hydrated from the barrel, and
`./variants` takes most of the urgency out of it: what a project usually wants to
import on its own are the classes, not the component. If a hydrated island
actually needs one component and pays for thirty, that is when they earn their
thirty-odd `tsup` entries.

**Action in the document:** none.

---
