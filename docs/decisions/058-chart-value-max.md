# § 58 · A ranking with a hidden axis cannot scale to its own maximum

**Release:** 0.11.0 · [index](README.md)

---

**System rule:** the chart types draw and the data is the project's. See
[§ 43](043-chart-type-names.md). `BarChart orientation="horizontal"` hides its
value axis on purpose: a ranking is read by comparing lengths, and the number is
in the tooltip.

**What the code did:** the value axis had no domain, so Recharts scaled it to
the data.

**What was wrong with it.** Comparing lengths only means something when a length
does. For a count — students per course — it does not matter where the axis
ends: the ranking is relative and the longest bar being full is honest. For a
quantity with a ceiling it is false. `cursos` has a «% visto» chart on `/admin`,
and there a course watched to 40 % draws as a full bar whenever it is the highest
on the list. With the value axis hidden, nothing on screen gives it away.

`cursos` kept that chart composed by hand on the library's chassis, with
`domain={domainMax ? [0, domainMax] : undefined}`, and wrote the reason in
`components/admin/charts/horizontal-bar-chart.tsx`.

**What it is now:** `valueMax`, on `SeriesChartProps`, so all three types take
it. It becomes `domain={[0, valueMax]}` on the value axis, spread in the same way
`tickOf` spreads the formatters.

**It is a floor for the top, not a clip.** `allowDataOverflow` stays at
Recharts' default, and with it off Recharts widens a declared domain to fit the
data: a datum at 120 moves the top to 120 instead of running off the edge.
Verified in `recharts@3.10.1`, `util/isDomainSpecifiedByUser.js`, `extendDomain`.
A bar cut off at the edge would be the same lie as the one this fixes, told the
other way round.

**Why `valueMax` and not `domain`.** Recharts' `domain` is a pair that admits a
bottom other than zero, `'auto'`, and strings like `'dataMax + 10'`. A bar that
does not start at zero lies, and a narrower prop leaves no way into that. The
name follows the one the chart already uses for this axis: `yTickFormatter`
formats «the VALUE axis».

**Why on all three types.** The value axis exists in all three, and a percentage
drawn as a line autoscaled to 0–40 exaggerates the same way. It shows there,
because the axis is visible; it was still something the project could not
correct.

**Why this was not caught in 0.8.0.** `orientation="horizontal"` was designed
from `cursos`'s ranking, and its own comment says so. It read the shape and not
the props of the one call site that passed a domain.

**Action in the document:** none. It is an API surface: the chart section's
drawing does not change, and what changed is that a project can say where its
scale ends.
