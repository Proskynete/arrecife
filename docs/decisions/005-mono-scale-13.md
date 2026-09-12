# § 5 · The mono scale goes to 13, not 12.5

**Release:** 0.6.0 · [index](README.md)

---

**Document:** metadata mono at 12.5px.
**Code:** `typeScale.meta` at 13px.

`limits.minScreenPx` is 13 and `textMuted` has «never below 13px» written on it.
This scale is exactly where muted metadata gets written — dates, reading minutes,
file names — so putting it at 12.5 would have made its most common use illegible
by half a pixel.

By the same argument the document's other two half-pixels do not get in: the card
excerpt at 15.5 uses `ui` (15) and inline code at 13.5 uses `meta` (13).

**Action in the document:** raise the metadata mono scale to 13.

---
