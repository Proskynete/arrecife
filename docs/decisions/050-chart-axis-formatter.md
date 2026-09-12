# § 50 · The tooltip's formatter never reached the axis

**Release:** 0.9.0 · [index](README.md)

---

**System rule:** the library imposes no locale. A value is printed as it arrives
and the project decides how it reads. See [§ 43](043-chart-type-names.md).

**What the code did:** `SeriesChartProps` took one `formatter`, and it reached
the tooltip only. The axes printed the raw key.

**What was wrong with it.** The rule was applied to half the surface it covers.
An axis tick is a value being printed for a reader in exactly the sense the rule
means, and it is the one you read while comparing — the tooltip needs a hover to
exist at all.

What it looked like in `cursos`, which is where this was found: a 30-day series
keyed by ISO date printed `2026-07-15` thirty times along the X axis, overlapping
into a grey band. Its hand-written charts had always cut it to `07-15`, and the
revenue chart had always prefixed the Y axis with `$`. Migrating to the library's
types would have lost both, so the migration stopped.

**What it is now:** `xTickFormatter` and `yTickFormatter`, on the same type,
alongside `formatter`.

**Why three formatters and not one.** They answer different questions and the
answers are different lengths. A tooltip has room for «15 de julio de 2026»; a
tick on a 30-day axis has room for «07-15». Collapsing them into one prop forces
the shorter to win, which makes the tooltip worse to save a prop.

**Why they return `string` and not `ReactNode`.** An axis tick is an SVG `<text>`
and a node has nowhere to go in it. The tooltip's `formatter` keeps `ReactNode`
because it is rendered into a box that is real markup.

**The shape of the wiring, which is not obvious.** They are spread and not
passed. `exactOptionalPropertyTypes` is on in this repo and Recharts declares
`tickFormatter` as required-if-present, so handing it an explicit `undefined` is
a type error rather than «no formatter». `tickOf()` returns `{}` or the prop,
which is the same shape `stackId` already used.

**Action in the document:** none. It is an API surface, not an identity decision:
the axes already look the way the chart section specifies, and what changed is
who gets to write the tick's text.
