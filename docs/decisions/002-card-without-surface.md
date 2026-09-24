# § 2 · The card has no surface of its own

**Release:** 0.6.0 · [index](README.md)

---

**Document:** «card · bg `#0B1620` over trench, or trench over abyss».
**Code:** the card is `surface`, and `#0B1620` does not enter as a token.

A fourth surface level with no light-mode counterpart is a token that lies in
half the projects: the generator emits both palettes, so a key that only exists
in `dark` keeps the dark value when the page is in light mode. The document does
not give the light equivalent either.

What **was** wrong and got corrected is the padding: the document's cards carry
26 (`lg`) and `CardHeader` was setting 16 (`md`). It changed in `Card*` and in
the three domain cards.

**Final state, 24 Sep 2026.** The cards section's spec line now says «sin
superficie propia, hereda el fondo», but the drawings keep `#0B1620` as a fill in
19 places: the card and demo panels, the text fields, the unchecked checkbox and
radio, and the player's containers. The author chose not to repaint them. The
code is the reference: cards inherit the page, fields and controls sit on
`surface`, and `#0B1620` never becomes a token.

**Action in the document:** none — the canvas keeps `#0B1620` in its drawings;
the code is the reference.

---
