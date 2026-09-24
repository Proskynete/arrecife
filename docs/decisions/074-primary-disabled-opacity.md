# § 74 · Disabled is half opacity, not a second palette

**Release:** unreleased · [index](README.md)

---

**System rule:** the Design System canvas gives the primary button an explicit
disabled pair, «disabled bg #1C3B40 texto #5D7D80», and the destructive one
«disabled bg #4A2422 texto #8A5F5C».

**What there was:** `variants/button.ts` applies `disabled:opacity-50` to every
variant. § 21 argued this for the danger pair only.

**What it is now:** opacity, for all six variants.

**Why:** a disabled pair per variant and per mode is a background and a text
colour, times six variants, times two modes, that exist only to say «you cannot press this», and every one of them has to be
re-measured whenever the variant's own colour moves — which § 69 and § 70 just
showed happens. Half opacity keeps the variant recognisable, derives from the
colour that is already measured, and cannot drift from it. Disabled controls are
exempt from WCAG contrast, so there is no ratio to protect.

**Action in the document:** in the Design System canvas, replace the two
disabled pairs with «disabled · la misma variante al 50% de opacidad».
