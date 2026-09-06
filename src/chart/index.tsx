import { useId } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { cn } from '../lib/cn.ts';
import { Text } from '../primitives/typography.tsx';
import { radius } from '../tokens/tokens.ts';

/**
 * The chassis for charts: container, tooltip and legend in the system's
 * vocabulary. Recharts paints; this decides how it looks.
 *
 * It is published at `@eduardoalvarez/arrecife/chart` and NOT at the root.
 * Recharts is heavy, and only one of the five projects draws metrics: hanging it
 * off the main index would force the other four to install it just so their
 * bundler could resolve an import they never execute. It is an OPTIONAL peer
 * dependency, by the same criterion that keeps `./og` and `./shiki` React-free.
 *
 * What this layer adds — and what was lost by copying shadcn's `chart.tsx` into
 * each project — are three things that drift on their own:
 *
 *   1. The series palette comes from `tokens.series` and follows the mode. There
 *      are four and they are told apart by hue, not by lightness.
 *   2. The grid, the axes and the cursor use `hairline` and `textMuted`, not
 *      Recharts' default greys, which are not part of this identity.
 *   3. The tooltip appears where it will stay: `isAnimationActive` is off
 *      everywhere, because the system does not animate position.
 *
 * Recharts' data pieces — `Area`, `Line`, `XAxis` — are still NOT re-exported.
 * They are Recharts' API, the project already knows it, and wrapping them would
 * be a layer of names to keep in sync with the library's version.
 *
 * What IS published, since this version, are three CHART TYPES on top of that
 * chassis: `AreaChart`, `BarChart` and `LineChart`. They are not wrappers over
 * Recharts' components of the same name — they take `data`, `series` and `xKey`
 * and draw the whole thing. See `docs/decisions.md` § 43 for why the names
 * collide on purpose.
 */

/**
 * The color of series `index`, as a custom property.
 *
 * It returns `var(--color-series-N)` and not the hexadecimal: read in JS, the
 * hex would be the one from whichever mode was active when the component
 * mounted, and it would not change when the theme is toggled. The variable is
 * resolved by the browser on every paint.
 *
 * It wraps around past four. Two series sharing a color is a visible failure,
 * and that is the correct signal: the chart has more categories than this
 * identity can tell apart, and what to do is group them into «otros».
 */
export function seriesColor(index: number): string {
  return `var(--color-series-${(Math.abs(index) % 4) + 1})`;
}

/** All four, in order, to hand to a `Pie` with `Cell` in one go. */
export const SERIES_COLORS = [0, 1, 2, 3].map(seriesColor);

export type ChartContainerProps = Omit<ComponentPropsWithoutRef<'figure'>, 'title'> & {
  /**
   * What the chart shows, in one sentence. Mandatory, like `Progress`'s `label`:
   * a bar `<svg>` with no accessible name is not «a chart without a label», it
   * is an empty region.
   */
  label: string;
  /**
   * What the chart says, in words. It goes in a visually hidden `figcaption`.
   *
   * It does not replace the chart: Recharts' accessibility layer already lets
   * you walk the points with the keyboard. It is the headline — «sube de 24 a 52
   * con una caída en mayo» — that no point-by-point walk gives you.
   */
  summary?: ReactNode;
  /** Height in pixels. Recharts needs a concrete one to measure itself. */
  height?: number;
  children: ReactNode;
};

/**
 * Wraps the chart in a `<figure>` with an accessible name and gives Recharts the
 * concrete height it needs to measure itself.
 *
 * The `<figure>` carries NO `role`: it already has its implicit one, and putting
 * `group` on top of it is a role not allowed for the element — axe flags it.
 * What it does carry is `aria-label`, which is what names it.
 *
 * And the content is NOT `aria-hidden`. That was the first thing tried, with the
 * argument that announcing every tick does not tell what the chart tells, and it
 * is wrong for two reasons: Recharts' accessibility layer makes the chart
 * walkable with the keyboard, and hiding a subtree containing focusable elements
 * is a violation in itself — focus lands on something that does not exist for
 * whoever is listening. The summary adds to that, it does not replace it.
 */
export function ChartContainer({
  label,
  summary,
  height = 320,
  className,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <figure
      aria-label={label}
      className={cn(
        'w-full',
        // The grid and the axes, with the system's tokens instead of Recharts'
        // default greys. They go as descendant variants because the nodes are
        // painted by the library and there is nowhere to put a class on them.
        '[&_.recharts-cartesian-grid_line]:stroke-hairline',
        '[&_.recharts-cartesian-axis-line]:stroke-hairline',
        '[&_.recharts-cartesian-axis-tick_text]:fill-text-muted',
        '[&_.recharts-cartesian-axis-tick_text]:font-mono',
        '[&_.recharts-cartesian-axis-tick_text]:text-chip',
        '[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-surface-raised',
        '[&_.recharts-curve.recharts-tooltip-cursor]:stroke-hairline-hover',
        '[&_.recharts-sector]:outline-none',
        '[&_.recharts-surface]:overflow-visible',
        className,
      )}
      {...props}
    >
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>

      {summary ? <figcaption className="sr-only">{summary}</figcaption> : null}
    </figure>
  );
}

/**
 * Recharts' `Tooltip` with the system's defaults: no animation, and the cursor
 * tinted `surfaceRaised`.
 *
 * You pass `content={<ChartTooltipContent />}` for the box.
 */
export function ChartTooltip(props: ComponentPropsWithoutRef<typeof Tooltip>) {
  return <Tooltip isAnimationActive={false} {...props} />;
}

export function ChartLegend(props: ComponentPropsWithoutRef<typeof Legend>) {
  return <Legend {...props} />;
}

/**
 * What Recharts passes to a `content`, declared here in short form.
 *
 * Recharts' types for this are open and drag in generics that add nothing at the
 * call site; `any` is banned in this repo, so what is actually read is declared
 * and the value is treated as `unknown`.
 */
export type ChartPayloadItem = {
  name?: string | number | undefined;
  value?: unknown;
  color?: string | undefined;
  dataKey?: string | number | undefined;
};

export type ChartTooltipContentProps = {
  active?: boolean | undefined;
  payload?: readonly ChartPayloadItem[] | undefined;
  label?: ReactNode;
  /** Formats the value. Without it, it is printed as is: the library imposes no locale. */
  formatter?: ((value: unknown, item: ChartPayloadItem) => ReactNode) | undefined;
  /** Hides the header, for a single-category chart. */
  hideLabel?: boolean;
  className?: string;
};

/**
 * The tooltip's box. It is a system card — `surface`, control border, standard
 * shadow — and not Recharts' white box, which in dark mode is a white rectangle
 * on top of a dark panel.
 *
 * The color swatch is an 8px square, not a circle: it is the same mark the
 * legend uses, and at 8 pixels a circle and a square are harder to tell apart
 * from each other than two colors of the palette are.
 */
export function ChartTooltipContent({
  active,
  payload,
  label,
  formatter,
  hideLabel = false,
  className,
}: ChartTooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className={cn(
        'rounded-card border-border bg-surface shadow-standard p-step-sm gap-step-xs flex flex-col border',
        className,
      )}
    >
      {hideLabel || label === undefined || label === null ? null : (
        <Text as="p" variant="meta" tone="muted">
          {label}
        </Text>
      )}

      <ul className="gap-step-xs flex flex-col">
        {payload.map((item, i) => (
          <li key={`${String(item.dataKey ?? item.name ?? i)}`} className="gap-step-xs flex items-center">
            <span
              aria-hidden="true"
              className="rounded-chip size-2 shrink-0"
              style={{ backgroundColor: item.color ?? seriesColor(i) }}
            />
            <Text as="span" variant="label" tone="secondary" className="font-normal">
              {item.name}
            </Text>
            <Text as="span" variant="label" className="ml-auto font-mono tabular-nums">
              {formatter ? formatter(item.value, item) : String(item.value ?? '')}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type ChartLegendContentProps = {
  payload?: readonly ChartPayloadItem[] | undefined;
  className?: string;
};

/** The legend, with the tooltip's same square swatch and the `label` scale. */
export function ChartLegendContent({ payload, className }: ChartLegendContentProps) {
  if (!payload || payload.length === 0) return null;

  return (
    <ul className={cn('gap-step-md pt-step-sm flex flex-wrap items-center justify-center', className)}>
      {payload.map((item, i) => (
        <li key={`${String(item.dataKey ?? item.value ?? i)}`} className="gap-step-xs flex items-center">
          <span
            aria-hidden="true"
            className="rounded-chip size-2 shrink-0"
            style={{ backgroundColor: item.color ?? seriesColor(i) }}
          />
          <Text as="span" variant="label" tone="secondary" className="font-normal">
            {item.value as ReactNode}
          </Text>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------ chart types */

/**
 * One series: which key of the datum it reads, what it is called, and — only if
 * you insist — what color it is.
 *
 * `color` is there for the case the palette cannot serve: a status series where
 * «pagado» has to be `success` and not «the first of the four». Leaving it out
 * is the normal case and the right one — `seriesColor(i)` follows the mode, and
 * a hard-coded hex does not. See the note on `seriesColor` above.
 */
export type ChartSeries = {
  /** The key this series reads in each datum. */
  key: string;
  /** What the legend and the tooltip call it. User-facing, so Spanish. */
  label: string;
  /** Overrides the palette. Defaults to `seriesColor(index)`. */
  color?: string | undefined;
};

/** A row of the chart: the category key plus one value per series. */
export type ChartDatum = Record<string, unknown>;

/**
 * What all three types take, and it is deliberately short: `data`, `series` and
 * `xKey`, plus the container's own `label`.
 *
 * Everything that is NOT here is the part that was being copied — the gradient,
 * the grid with no vertical lines, the axes with no line and no tick, the
 * tooltip with no cursor. `cursos` wrote all of it four times, once per chart,
 * and the fourth one would have had a different `strokeWidth` from the first.
 * The drawing is the system's; the data is the project's.
 */
export type SeriesChartProps = Omit<ChartContainerProps, 'children'> & {
  data: readonly ChartDatum[];
  series: readonly ChartSeries[];
  /** The key on the category axis: the day, the month, the course. */
  xKey: string;
  /** Formats the value in the tooltip. The library imposes no locale. */
  formatter?: ((value: unknown) => ReactNode) | undefined;
  /**
   * Shows the legend. It defaults to «only when there is more than one series»:
   * a legend naming the one line already named by the chart's own heading is a
   * row of pixels that says nothing.
   */
  legend?: boolean | undefined;
};

/** Recharts wants a mutable array and the props are read-only. No copy, no `any`. */
const rows = (data: readonly ChartDatum[]) => data as ChartDatum[];

const color = (series: ChartSeries, index: number) => series.color ?? seriesColor(index);

/**
 * The margin every type uses. `left: 0` because the value axis measures itself,
 * and `top: 8` so the topmost point is not clipped by the container's edge.
 */
const MARGIN = { left: 0, right: 12, top: 8, bottom: 0 };

/** An axis with no line and no tick mark: the grid already says where the values are. */
const AXIS = { tickLine: false, axisLine: false } as const;

const legendOf = (series: readonly ChartSeries[], legend?: boolean | undefined) =>
  (legend ?? series.length > 1) ? <ChartLegend key="legend" content={<ChartLegendContent />} /> : null;

const tooltipOf = (formatter?: ((value: unknown) => ReactNode) | undefined) => (
  <ChartTooltip
    key="tooltip"
    // No cursor band. The system tints the hovered row of a table and not the
    // column of a chart: at four series the band covers the points it is meant
    // to help you read.
    cursor={false}
    content={<ChartTooltipContent formatter={formatter ? (value) => formatter(value) : undefined} />}
  />
);

/**
 * A series over time, with the fill fading out underneath it.
 *
 * The gradient is the whole reason this is a component and not three lines at
 * the call site: it needs a `<linearGradient>` with an id, the id has to be
 * unique on the page, and the two projects that wrote it by hand both hardcoded
 * one — a second chart on the same screen would have taken the first one's fill.
 * `useId` settles it.
 *
 * 0.5 down to 0.05 is the ramp `cursos` arrived at, and `type="natural"` is its
 * curve: a monotone spline reads as a measurement and a straight segment reads
 * as a schedule. The stroke is 2, which is the one weight in the system that is
 * neither a hairline nor a border.
 *
 * With more than one series the areas OVERLAP rather than stack, because a
 * stacked area answers «how much in total» and this library has no way to know
 * that is the question. When it is, pass `stacked`. When you want to compare
 * rather than add up, the answer is `LineChart`.
 */
export type AreaChartProps = SeriesChartProps & {
  /** Adds the series up instead of overlaying them. */
  stacked?: boolean | undefined;
};

export function AreaChart({
  data,
  series,
  xKey,
  formatter,
  legend,
  stacked = false,
  ...container
}: AreaChartProps) {
  const id = useId();

  return (
    <ChartContainer {...container}>
      <RechartsAreaChart data={rows(data)} margin={MARGIN}>
        <defs>
          {series.map((s, i) => (
            <linearGradient key={s.key} id={`${id}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color(s, i)} stopOpacity={0.5} />
              <stop offset="95%" stopColor={color(s, i)} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>

        <CartesianGrid vertical={false} />
        <XAxis dataKey={xKey} {...AXIS} tickMargin={8} />
        <YAxis {...AXIS} width={40} />

        {tooltipOf(formatter)}
        {legendOf(series, legend)}

        {series.map((s, i) => (
          <Area
            key={s.key}
            dataKey={s.key}
            name={s.label}
            type="natural"
            stroke={color(s, i)}
            strokeWidth={2}
            fill={`url(#${id}-${s.key})`}
            isAnimationActive={false}
            {...(stacked ? { stackId: 'stack' } : {})}
          />
        ))}
      </RechartsAreaChart>
    </ChartContainer>
  );
}

/**
 * Bars, upright or lying down.
 *
 * `orientation` is named for what you SEE and not for what Recharts calls it,
 * and the two are opposites: Recharts' `layout="vertical"` draws horizontal
 * bars. That inversion is a coin flip every time somebody writes it, so it is
 * settled here once — `vertical` means the bars grow upwards.
 *
 * `horizontal` is the shape for a ranking, which is what `cursos` uses it for:
 * course names on the left, one bar each. It reserves 130px for the category
 * axis and hides the value axis, because a ranking is read by comparing lengths
 * and not by reading a number off a scale — the number is in the tooltip.
 *
 * The corner radius is `radius.chip`, the system's smallest. A bar is a chip
 * lying down, and picking a number that is not a token is how a fifth radius
 * gets into the system without anybody deciding it should.
 */
export type BarChartProps = SeriesChartProps & {
  /** `vertical` grows the bars upwards, which is the default. `horizontal` is a ranking. */
  orientation?: 'vertical' | 'horizontal' | undefined;
  /** Stacks the series instead of putting them side by side. */
  stacked?: boolean | undefined;
};

export function BarChart({
  data,
  series,
  xKey,
  formatter,
  legend,
  orientation = 'vertical',
  stacked = false,
  ...container
}: BarChartProps) {
  const lying = orientation === 'horizontal';

  return (
    <ChartContainer {...container}>
      <RechartsBarChart
        data={rows(data)}
        margin={MARGIN}
        {...(lying ? { layout: 'vertical' as const } : {})}
      >
        {/*
          The grid runs ACROSS the bars and never along them. A line parallel to
          what it is measuring adds nothing and crosses every bar it touches.
        */}
        <CartesianGrid vertical={lying} horizontal={!lying} />

        {/*
          Two elements and not a fragment around them. Recharts finds its axes by
          walking `children` and looking for its own component types, so what it
          is handed has to be those components or an array of them.
        */}
        {lying
          ? [
              <YAxis key="category" dataKey={xKey} type="category" {...AXIS} width={130} />,
              <XAxis key="value" type="number" hide />,
            ]
          : [
              <XAxis key="category" dataKey={xKey} {...AXIS} tickMargin={8} />,
              <YAxis key="value" {...AXIS} width={40} />,
            ]}

        {tooltipOf(formatter)}
        {legendOf(series, legend)}

        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={color(s, i)}
            radius={lying ? [0, radius.chip, radius.chip, 0] : [radius.chip, radius.chip, 0, 0]}
            isAnimationActive={false}
            {...(stacked ? { stackId: 'stack' } : {})}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
}

/**
 * Lines, for comparing series against each other.
 *
 * It is the type that does NOT add anything up, which is the whole reason it
 * exists next to `AreaChart`: four filled areas on top of each other are a
 * total, and four lines are four things you can tell apart.
 *
 * No dots at rest. A point per datum on a 90-day series is a dotted line, and
 * the value is in the tooltip; the dot comes back on hover because that is
 * where it means «this one».
 */
export type LineChartProps = SeriesChartProps;

export function LineChart({
  data,
  series,
  xKey,
  formatter,
  legend,
  ...container
}: LineChartProps) {
  return (
    <ChartContainer {...container}>
      <RechartsLineChart data={rows(data)} margin={MARGIN}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={xKey} {...AXIS} tickMargin={8} />
        <YAxis {...AXIS} width={40} />

        {tooltipOf(formatter)}
        {legendOf(series, legend)}

        {series.map((s, i) => (
          <Line
            key={s.key}
            dataKey={s.key}
            name={s.label}
            type="natural"
            stroke={color(s, i)}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
}
