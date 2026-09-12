# § 1 · One control radius

**Release:** 0.6.0 · [index](README.md)

---

**Document:** `sm 8 · md 10 · lg 12`.
**Code:** `radius.control` (10) at all three sizes.

Stepping the radius by size demands three radius tokens for a two-pixel
difference. A single control radius is easier to defend and much easier to keep
in sync across five projects.

What **was** wrong and got corrected is the horizontal padding, which now comes
from the document: `control.sm 14 · control.md 22 · control.lg 30`. They are in
`tokens.ts` as a group of their own and not inside `spacing`, because 14, 22 and
30 do not compose with 8/12/16/26/40 and must not be offered as loose margins.

**Action in the document:** remove the radius stepping from the button table.

---
