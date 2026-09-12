# § 61 · The token set is emitted whole, because a token read by `var()` is asked for by no class

**Release:** 0.12.0 · [index](README.md)

---

**System rule:** the four series colors are the palette's, they are told apart by
hue and they follow the mode. See [§ 18](018-chart-series-palette.md) for where
they come from, since the document does not give them.

**What the code did:** `theme.css` opened with `@theme {`, and
`seriesColor(i)` returned `var(--color-series-N)` — deliberately, so the color is
resolved by the browser on every paint instead of freezing to whichever mode was
live when the chart mounted.

**What was wrong with it.** **Tailwind v4 emits a theme variable only if some
utility it generated uses it**, and a token read with `var()` from JavaScript is
used by no utility at all. No project writes `bg-series-1` — the color is not
requested by class, it is read by `var()` — so Tailwind dropped all four as
unused. The `var()` resolved to nothing, and a `fill` that resolves to nothing is
black.

Measured in the browser in `blog-content-manager`, on `/analitica`, before the
fix:

```js
getComputedStyle(document.documentElement).getPropertyValue('--color-series-1') // ""
getComputedStyle(bar).fill                                                      // "rgb(0, 0, 0)"
getComputedStyle(document.documentElement).getPropertyValue('--color-accent')   // "#35d6c0"
```

`--color-accent` was there, and not because it is declared anywhere different:
because dozens of classes ask for it. The difference between the two was never
where they are written. It was whether something requests them by class.

**And it fails without saying so, which is what made it expensive.** No error in
the console, none in the build. Every `<rect>` was in the DOM at its correct
size, and on a dark page a black fill reads as «there is no data». The report
that arrived was «the information is not showing», which is exactly what it looks
like from outside.

**It was live in a second project too, unseen.** In `cursos`'s compiled CSS
`--color-series-1` appears only inside `[data-theme=dark]` and
`[data-theme=light]`, never in `:root`; its `<html>` carries `class="dark"` and
no `data-theme`; and none of its four charts passes `color` per series. The
comment in its `globals.css` says the `[data-theme]` blocks do not match and that
the `@theme` defaults therefore apply — true for every token Tailwind emits, and
false for exactly these four.

**What it is now:** `@theme static`. Tailwind then emits every variable the block
declares, whether a class asks for it or not. One word, no API change, and it
covers the five projects at once.

**Why static, and not a fallback in `seriesColor`.** `var(--color-series-1,
#35D6C0)` resolves this case and writes the hex a second time, in the one
subpackage that is not allowed to hold hexes — which is the drift this library
exists to remove. It would also fix the four series and leave the mechanism in
place for the next token read the same way.

**Why static, and not a check in `npx arrecife`.** That was the third option:
warn when a project imports `./chart` and its `<html>` declares no `data-theme`.
It is the right family — the doctor already reads the project's CSS — and with
the tokens in `:root` there is no longer a condition to warn about. A check that
tells five projects to declare an attribute is five workarounds for one missing
word here.

**Why the whole block and not just the series.** Wrapping four lines in their own
static block is cheaper and fixes the instance. The failure is not about series:
it is that a published token set was a *subset of itself, discovered by usage*,
and any token a project reads with `var()` from its own JS breaks identically and
just as quietly. A token set is a contract. The fix is that all of it ships.

**What it costs, measured.** Compiling Tailwind with `theme.css` on top, the way
a consuming project does — the same `compileClasses` harness
`scripts/theme-css.test.mjs` uses, run once with `@theme` and once with `@theme
static`:

| Project's class vocabulary | Raw | Gzipped |
| --- | --- | --- |
| all 208 classes the library itself writes | 29.8 KB → 31.4 KB (**+1.6 KB**) | 6.2 KB → 6.4 KB (**+234 B**) |
| five classes, i.e. a project that writes almost nothing | 8.0 KB → 11.2 KB (**+3.2 KB**) | 2.4 KB → 3.0 KB (**+579 B**) |

The cost falls as a project uses more of the system, because what static adds is
exactly the tokens nobody asked for. The ceiling is the whole set, and the whole
set is 103 custom properties.

It is also smaller than it looks: the `[data-theme='dark']` and
`[data-theme='light']` blocks are plain CSS, not `@theme`, so every color, series
and gradient already shipped twice in full whatever any class asked for. What
static adds on top of that is the typography, shape and rhythm tokens a project
does not use.

**And why Storybook never showed it either.** `.storybook/preview.tsx` switches
the mode with `withThemeByDataAttribute`, so the preview root ALWAYS carries a
`data-theme` — there is no state of Storybook in which it does not. The
`[data-theme='dark']` and `[data-theme='light']` blocks are plain CSS and always
travel, so they supplied the four variables and the bars, the doughnut and the
palette swatches in `chart.stories.tsx` all drew correctly, in both modes, with
axe green. The library was rendering under the exact workaround the affected
project had to discover on its own. That is the same gap
`scripts/theme-css.test.mjs` was created for and says so in its header: the
failure lived between what the library publishes and what the library uses.

**Why the test did not catch it, and what the new one does.** The test was there
and it asserted the right thing — `scripts/theme-css.test.mjs` compiled
`bg-series-1` and checked what it resolved to. Asking for the class is what
generated the utility that made the variable used: **the test created the
condition that made it pass.** The new one compiles `flex` — a class that asks
for none of our tokens — and then asserts that all 103 declared properties are in
`:root`. It fails on the old output, and it fails for the next token read by
`var()` as well, which the four-series version of it would not.

**Action in the document:** none. No value changes and no drawing changes. The
series palette is already recorded in § 18 as the code's, awaiting the canvas.
