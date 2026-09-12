# § 43 · The chart types take the names Recharts uses

**Release:** 0.8.0 · [index](README.md)

---

**System rule, stated in `chart/index.tsx` itself:** «the data pieces —
`BarChart`, `Line`, `XAxis` — are NOT re-exported. They are Recharts' API, the
project already knows it, and wrapping them would be a layer of names to keep in
sync».

**What stayed:** `./chart` publishes `AreaChart`, `BarChart` and `LineChart` —
three of Recharts' names, on three components that are not Recharts'.

**The rule was right and it was answering a different question.** Re-exporting
`Bar` unchanged buys nothing and costs a name to maintain. These are not
re-exports: they take `data`, `series` and `xKey` and draw the whole chart. What
they replace is not an import, it is sixty lines of composition — a
`linearGradient` with a hardcoded id, a `CartesianGrid vertical={false}`, two axes
with `tickLine` and `axisLine` off, a `type="natural"` and a `strokeWidth`. None
of that is a decision the project made; it is the system's drawing, written in the
project. `cursos` has four charts doing it, all four against a local 373-line copy
of shadcn's wrapper, and the fifth would have had a different `strokeWidth` from
the first.

**The collision is deliberate and it is the lesser cost.** A project that draws a
chart imports one of these and not Recharts' — that is the point — and the two are
never both needed in the same file. `SeriesAreaChart` or `ChartArea` would avoid a
collision nobody hits by making every call site read worse forever. The one file
where both appear is this library's own module, and it aliases Recharts' three on
import.

**What is NOT covered.** A doughnut is not a series over a category axis, so it
has no type and it is not missing one: `ChartContainer` plus Recharts' `Pie` is
the answer, and the chassis is the part that mattered. The three types are the
three shapes the four charts of `cursos` actually are.

**Two things the hand-written copies got wrong**, both now the component's
problem: the gradient's id came from a string literal, so a second chart on the
same screen took the first one's fill — `useId` settles it; and
`orientation="horizontal"` is named for what you see, against Recharts'
`layout="vertical"`, which draws horizontal bars and is a coin flip every time
somebody writes it.

**Action in the document:** none. The palette, the grid and the axes were already
specified; this is the composition that uses them.

---
