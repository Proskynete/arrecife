# § 75 · The measures that shipped, component by component

**Release:** unreleased · [index](README.md)

---

**System rule:** the Design System canvas gives exact measures for every
component. The ones below are drawn one way and have shipped another in the
consuming projects, with nothing reported against them. § 1, § 3 and
§ 13 already covered the control radius, the alert and the player; this is the
rest.

**What it is now**, canvas → code:

| component | canvas | code |
| --- | --- | --- |
| Button heights | padding 8/12/15 vertical | fixed `h-8/10/12` (32/40/48), so text and icon buttons share a baseline |
| Modal | fosa, r16, max 440, veil `rgba(6,15,20,.72)` | `surface`, r16, `max-w-content` (760), veil `brand-hull` at 70% |
| Table | header fosa, rows 17/24 padding, alternate `#0D1A22`, dividers at 25% | card-radius container with hairline border, header mono muted on the page, cells 12px padding, hairline dividers, hover `surface` |
| Menu and Select panel | `surfaceRaised`, r12, pad 7, items r8 | `surfaceRaised`, r16, pad 4, items r6 at 36px |
| Tabs | group with a single border | `surface` group with no border, r10, pad 4 |
| Checkbox | 19px, r5 | 20px, r6 |
| Radio | 19px, checked = 5px border | 20px, checked = 10px dot |
| Switch | 42×24, knob 18 | 44×24, knob 16 |
| Newsletter panel | section r20, pad 44, two columns until 900; component fosa r16, pad 30, max 760 | one panel, section gradient, r16, pad 26, two columns from 768; the button is full width on phones and a pose in `aside` replaces the face |
| Toast and code block | r12 | r14 (`card`) |
| Icon-to-text gap in Alert and Toast | 8px, always | 12px (Alert), 16px (Toast) |
| PageHeader | eyebrow as a route, mono muted; bajada 17; a 15px context paragraph | eyebrow mono accent uppercase; description `body` 18; no context slot |
| Tooltip | r8 | r6 (`chip`): there is no 8px radius token |
| Blockquote | padding 22px, body line-height 1.7 | padding 16px, line-height 1.75 (`body`) |
| Pagination | arrows only | the words «Anterior» and «Siguiente», which carry the accessible name without an extra label |
| AudioPlayer icons | 1em, sized by the text next to them | fixed sizes, because the player has no text-size token to hang them on |

One behaviour is recorded here only so it is not lost: the AudioPlayer's
progress knob fades in with `transition-opacity`, which is not one of the
declared motion exceptions (§ 20). It is a code bug, not a measure, and the fix
belongs in the component, not on the canvas.

**Why:** each of these is a measure, not a behaviour, and every one of them was
chosen against a real screen in a consuming project: 760 because a modal in
`cursos` holds a form, 12px cell padding because admin tables have three actions
per row, r16 panels because the menu sits on the same radius as the card it opens
from. Moving them back to the drawing would restyle four sites for no reported
problem. What the canvas gets right about behaviour — which state is shown, what
is interactive, what never moves — the code already follows.

**Action in the document:** update each row of the table above in the Design
System canvas to the code's value, in the component's own spec line.
