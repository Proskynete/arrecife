import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Legend, ResponsiveContainer, Tooltip } from 'recharts';

import { cn } from '../lib/cn.ts';
import { Text } from '../primitives/typography.tsx';

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
 * The data pieces — `BarChart`, `Line`, `XAxis` — are NOT re-exported. They are
 * Recharts' API, the project already knows it, and wrapping them would be a
 * layer of names to keep in sync with the library's version.
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
