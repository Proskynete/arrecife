# § 28 · There is a third tone, and two of them are the same sand

**Release:** 0.7.0 · [index](README.md)

---

**Document:** `../architecture/design-system.md` — «biolume para lo neutro y arena SOLO
cuando el número es el problema».
**Code:** three tones. `neutral` is biolume, and `alert` AND `achievement` are
both sand.

**What the count said.** `cursos` draws 10 KPI cards and keeps its own component
for them. Two of the ten count diplomas and completed modules. There was no tone
for that, so they were being painted with `alerta`, which gets the colour right —
both lean to sand — and the meaning exactly backwards.

That is the failure this library exists to prevent, arriving from the other side.
The system names by meaning; making «this is bad» the only way to say «this
stands out» is naming by drawing with extra steps.

**Why not `success`.** Two reasons, and the first is already written into
`tokens.ts`: in light mode `success` and `accent` are two nearly identical
greens, which is why the chart series palette skips `success` and picks
`brand.body` instead. The second is that the manual already answers it — § 09
assigns `cursos` «caras en progreso y celebración · arena». Celebration is sand
in this identity, not green.

**Where it bends the document.** The design system says sand ONLY for the
problem case, and «only» is now false. The rule underneath it survives, and it is
the one worth keeping: **sand is for the number that is not just a number.** A 0
of design systems and 248 diplomas are both numbers you are meant to stop on;
neither is a datum like «12 aplicaciones». The document's sentence named one half
of that and the code needed both.

Two names for one colour is not a redundancy, it is the point: the API is the
meaning, the colour is the implementation, and the day the identity gives
celebration its own value there is already a name to hang it on.

**`alerta` → `alert`.** The one public API value the 0.6.0 English sweep did not
reach, and `llms.txt` was publishing it — so an agent reading the document from a
consuming project wrote Spanish into a library that had decided it would not have
any. It is a genuine break, since `Stat` shipped in 0.5.0, and it goes with the
`!` and the footer.

**`delta` is data and `direction` never picks a colour.** The prop could have
been a free `ReactNode` and the project would format it; the data shape exists so
the system can hold one rule. That rule is not «up is green». «+12 alumnos» and
«+12 errores» point the same way and mean opposite things, so the arrow says
which way and `tone` says whether it matters — a judgement the call site has
already made. The glyph is `aria-hidden` and «sube», «baja» or «sin cambio» goes
to the screen reader in its place, because colour and shape are not channels a
screen reader has.

The glyphs are `ChevronUp`, `ChevronDown` and `Minus`, which `lib/glyphs.tsx`
already had. It did not grow: that is the promise it makes.

**`spark` is a slot, and there is no `Sparkline` component.** The backlog said
the sparkline is the piece that brings weight and that `./chart` would be its
home if it entered. It does not enter. The admission criterion is «it encodes an
identity rule, it has two or more consumers, and it drags in no project
infrastructure», and exactly one project draws sparklines — so by the repo's own
rule it is not a component yet. A `ReactNode` slot costs the barrel nothing and
unblocks all ten cards today, which is the same answer `icon` already gives. If a
second project starts drawing them, that is when it earns its place in `./chart`.

**Action in the document:** add the third value to the `Stat` line — «arena para
`alert` y para `achievement`; biolume para lo neutro» — and note that sand covers
both the number that is the problem and the number that is the reward.

---
