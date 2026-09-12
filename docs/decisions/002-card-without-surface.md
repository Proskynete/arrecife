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

**Action in the document:** delete `#0B1620` from the cards section.

---
