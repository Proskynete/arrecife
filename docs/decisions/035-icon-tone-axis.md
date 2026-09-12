# § 35 · The weight is an axis with three values, and none of them is `bold`

**Release:** 0.7.0 · [index](README.md)

---

**Document:** «funcionales en trazo 1.6», which is one stroke and no second one.
**Code:** `Icon` takes a `tone` — `action` · `current` · `quiet` — and the weight
follows from it. `weight` is not a prop.

**What § 29 left half-done.** That entry answered «which set» and «drawn how» and
it answered them well: `regular` IS the document's 1.6, measured and not derived.
What it did not do is notice that it had settled a DEFAULT and written it down as
a CONSTANT. The generated documentation says «Do not change the weight either» in
so many words, and by the time the sidebar had icons in it that sentence was
already false — the active item needed something the default could not say.

**`current` is what earns the axis, and the argument is not taste.** A sidebar
item that is the one you are on already carries `aria-current="page"` and paints
itself biolume. Colour on its own is the single channel WCAG 1.4.1 says may not
carry meaning, so the state was resting on one channel and a landmark attribute
nobody sees. A filled glyph is the second visible channel, and it is the one that
survives `forced-colors`, where the biolume is replaced by the system palette and
the distinction disappears. It costs nothing: Phosphor already ships the fill.

**`quiet` is the opposite problem.** In a metadata row — a date, a reading time,
a tag count — the icon is not the point of the line, and at `regular` it draws as
heavy as the text it is annotating. `light` is 12 on a 256 grid = 0.0469em, a
quarter under the system line, which is enough to put it behind the text without
it disappearing.

| `tone` | Weight | Line | What it is |
| --- | --- | --- | --- |
| `action` · default | `regular` | 0.0625em | A control, or the label of one |
| `current` | `fill` | — | The one of a set you are on |
| `quiet` | `light` | 0.0469em | Furniture: not a control, not a state |

**Three and not six, and `weight` is not a prop.** Phosphor ships `thin`,
`light`, `regular`, `bold`, `fill` and `duotone`. Three of them have a role here
and three do not: `thin` is `light` with less of it, `duotone` needs a second
colour this system has no token for, and **`bold` is the emphasis step a
`strokeWidth` set would have offered** — which this system does not want, because
it emphasises with colour and has since the first button. Exposing `weight`
alongside `tone` would have given two ways to say the same thing and one way to
say three things that mean nothing, which is exactly the failure § 26's JSDoc is
about on the other subpath.

`ICON_WEIGHT` stays exported. It is no longer «the weight», it is what
`tone="action"` resolves to, and it is still the right thing to reach for when a
project draws a Phosphor icon directly instead of through the wrapper.

**It repealed four sentences, and three of them were in generated files.** The
handoff was written against the code and against § 21, § 22 and § 29 and all of
that held; what nobody re-read was the documentation, where
`docs/llms.template.md` said «Do not change the weight either» and «at the
system's size and weight» in the singular, `AGENTS.md` said «fixes the size at
1em and the weight at `regular`», and the `Icons/Icon` weight story opposed
`light · regular · bold` — putting the one weight the decision rules out in the
middle of the exhibit. The edits go in `docs/llms.template.md`, never in
`llms.txt`, which `scripts/build-llms.mjs` writes. **This is the same failure
mode as § 15 and as § 22's forgotten row**: two places that have to agree, living
in different files, with nothing checking that they do.

**Action in the document:** the icon line § 29 already asked for gains a second
half — «peso por rol · `regular` funcional, `fill` para el elemento actual,
`light` para lo que acompaña».

---
