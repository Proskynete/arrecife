# § 71 · The light borders sit one step lighter, and five tokens have no drawing

**Release:** unreleased · [index](README.md)

---

**System rule:** the Design System canvas, light mode, draws a card border
`#E6DFD2`, an input border `#DDD4C4` and a secondary-button border `#CCC2B0`.

**What there was:** the light palette in `tokens.ts` has three border roles, each
one step lighter than the drawing:

| role | code | the canvas's nearest |
| --- | --- | --- |
| `border` (controls) | `#E6DFD2` | input `#DDD4C4` |
| `hairline` (dividers, cards) | `#EBE6DC` | card `#E6DFD2` |
| `hairlineHover` | `#D3C8B2` | secondary `#CCC2B0` |

`#EBE6DC` exists in no canvas as a specification — only in the Manual's own page
styling — and `#D3C8B2` was derived by a ΔL* step from the hairline, as the
README records.

Five more tokens are used in production and drawn nowhere:

- `light.surfaceRaised #EFE9DE`, the light menus and active tabs.
- `light.accentHover #0C7466` and `light.warmHover #96511F`.
- `spacing.section 96`, the vertical gap between page sections.
- `size.wide 1180`, the wide container. The canvas's page is 1240 max.

**What it is now:** the code values, all of them. They are what the consuming
projects render today, and the lighter borders are the reason paper does not look
ruled.

**Why:** a border on paper reads darker than the same step on a screen, which is
the argument § 9 already made for the light gradients. Aligning to the canvas now
would darken every card in `cursos`, which is the one light surface, for a
difference no one has reported.

**Action in the document:** in the Design System canvas's light section, set the
card border to `#EBE6DC`, the input border to `#E6DFD2` and the secondary border
to `#D3C8B2`, and add the missing values to its palette: raised surface
`#EFE9DE`, hovers `#0C7466` and `#96511F`, section gap 96 and wide container
1180.
