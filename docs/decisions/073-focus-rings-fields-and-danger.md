# § 73 · Text fields keep the ring, and the danger button keeps biolume for now

**Release:** 0.12.3 · [index](README.md)

---

**System rule:** the Design System canvas says «foco: borde bioluz, sin outline»
for fields, and draws the destructive button's focus as a coral ring
(`0 0 0 5px #f4736b`).

**What there was:** § 37 settled the ring for buttons and ratified sand for the
conversion button. It said nothing about fields or about danger. The code:

- `Input`, `Textarea`, `Select` and `DateField` draw `border-accent` **and** the
  `focus-ring` outline on `:focus-visible`.
- `destructive` and `destructiveOutline` use the same biolume ring as every other
  button.

**What it is now:** both stay as they are.

**Why:** a border that changes colour is a 1px signal on a control that already
has a 1px border, and it is the easiest focus state to miss — worse on paper,
where the light border and the page are two steps apart. The ring is the same
indicator every other control uses, so keyboard focus looks the same wherever it
lands. The field keeps both: the border says «this is the field», the ring says
«focus is here».

The danger ring is a gap, not a decision against coral: a ring in the button's
own colour is what § 37 did for sand. Until a `focus-ring-danger` utility exists
it stays biolume, which at least passes contrast against both themes.

**Action in the document:** none. Applied on the Design System canvas on 24 Sep
2026: both focus lines read «borde bioluz más el anillo del sistema, 2px +
offset 3px». Revisit when the code adds the coral ring.
