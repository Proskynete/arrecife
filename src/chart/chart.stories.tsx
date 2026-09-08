import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cell, Pie, PieChart } from 'recharts';

import { Block, Note } from '../../stories/utils.tsx';
import {
  AreaChart,
  BarChart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  LineChart,
  SERIES_COLORS,
  seriesColor,
} from './index.tsx';

const meta = {
  title: 'Charts/Chart',
  component: ChartContainer,
  // `label` and `children` are mandatory in the kind: without them the meta does
  // not compile, which is exactly what is wanted of an accessible name.
  args: { label: 'Gráfica de ejemplo', children: <div /> },
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const ENROLLMENTS = [
  { month: 'ene', nuevas: 24, bajas: 4 },
  { month: 'feb', nuevas: 31, bajas: 6 },
  { month: 'mar', nuevas: 28, bajas: 3 },
  { month: 'abr', nuevas: 44, bajas: 7 },
  { month: 'may', nuevas: 39, bajas: 5 },
  { month: 'jun', nuevas: 52, bajas: 8 },
];

const SOURCES = [
  { source: 'Directo', value: 42 },
  { source: 'Buscador', value: 31 },
  { source: 'Newsletter', value: 18 },
  { source: 'Redes', value: 9 },
];

const COURSES = [
  { course: 'Construir con IA', alumnos: 182 },
  { course: 'TypeScript a fondo', alumnos: 134 },
  { course: 'Arquitectura de front', alumnos: 96 },
  { course: 'Diseño de sistemas', alumnos: 61 },
];

const SERIES = [
  { key: 'nuevas', label: 'Nuevas' },
  { key: 'bajas', label: 'Bajas' },
];

/**
 * A series keyed by ISO date, which is what a query returns and what the axis
 * cannot print. It is the shape that motivated the tick formatters: thirty of
 * these along an axis overlap into a grey band.
 */
const REVENUE = [
  { day: '2026-07-11', ingresos: 1200 },
  { day: '2026-07-12', ingresos: 1850 },
  { day: '2026-07-13', ingresos: 1420 },
  { day: '2026-07-14', ingresos: 2310 },
  { day: '2026-07-15', ingresos: 1980 },
  { day: '2026-07-16', ingresos: 2640 },
];

/* -------------------------------------------------------------- the types */

/**
 * The type the four charts of `cursos` were written by hand for. Everything
 * visible here — the gradient, the grid with no vertical lines, the axes with no
 * line — is the component's, and the story passes only data.
 */
export const Area: Story = {
  render: () => (
    <div>
      <AreaChart
        label="Matrículas nuevas por mes, de enero a junio"
        summary="Sube de 24 en enero a 52 en junio, con una caída en mayo."
        height={260}
        data={ENROLLMENTS}
        series={[{ key: 'nuevas', label: 'Nuevas' }]}
        xKey="month"
      />
      <Note>
        Sixty lines of `AreaChart` in the project became six props. The gradient&rsquo;s id comes
        from `useId`, so two charts on one screen do not share a fill — which is what both
        hand-written copies got wrong.
      </Note>
      <Note>
        No legend: with one series it would name what the heading already names. It appears on its
        own from the second series onwards.
      </Note>
    </div>
  ),
};

export const AxisFormatters: Story = {
  name: 'Area · axis formatters',
  render: () => (
    <div>
      <AreaChart
        label="Ingresos por día, del 11 al 16 de julio"
        summary="Sube de 1.200 a 2.640 dólares, con caídas el 13 y el 15."
        height={260}
        data={REVENUE}
        series={[{ key: 'ingresos', label: 'Ingresos' }]}
        xKey="day"
        xTickFormatter={(value) => String(value).slice(5)}
        yTickFormatter={(value) => `$${value}`}
        formatter={(value) => `$${value}`}
      />
      <Note>
        The key is `2026-07-15` and the tick says `07-15`. Without `xTickFormatter` the axis prints
        the whole key, and on a 30-day range the labels overlap into a band. See
        `docs/decisions/0.9.md` § 50.
      </Note>
      <Note>
        `yTickFormatter` and `formatter` are separate on purpose. The axis is what you read while
        comparing; the tooltip needs a hover to exist at all, and it has room for more.
      </Note>
    </div>
  ),
};

export const AreaStacked: Story = {
  name: 'Area · stacked',
  render: () => (
    <div>
      <AreaChart
        label="Matrículas nuevas y bajas por mes, apiladas"
        summary="Nuevas y bajas sumadas mes a mes, de 28 en enero a 60 en junio."
        height={260}
        data={ENROLLMENTS}
        series={SERIES}
        xKey="month"
        stacked
      />
      <Note>
        `stacked` answers «cuánto en total». Without it the two areas overlap, which is the honest
        default: the library cannot know whether the series add up.
      </Note>
    </div>
  ),
};

export const Bars: Story = {
  render: () => (
    <div>
      <BarChart
        label="Matrículas nuevas y bajas por mes, de enero a junio"
        summary="Enero 24 nuevas y 4 bajas; febrero 31 y 6; marzo 28 y 3; abril 44 y 7; mayo 39 y 5; junio 52 y 8."
        data={ENROLLMENTS}
        series={SERIES}
        xKey="month"
      />
      <Note>
        The colors come from `tokens.series` as `var(--color-series-N)`, not as a hexadecimal read
        in JS: that way they follow the mode. Switch the theme in the bar above and the chart
        changes with it, without remounting.
      </Note>
      <Note>
        `label` is mandatory, as in `Progress`. What gets read is the label and the `summary`:
        announcing every tick on an axis does not tell what the chart tells.
      </Note>
      <Note>The tooltip appears where it will stay. `isAnimationActive` is off everywhere.</Note>
    </div>
  ),
};

/**
 * The ranking. It is the one that inverts Recharts&rsquo; vocabulary, so the story
 * exists mostly to prove the prop means what it says.
 */
export const BarsHorizontal: Story = {
  name: 'Bars · horizontal',
  render: () => (
    <div>
      <BarChart
        label="Alumnos por curso"
        summary="Construir con IA 182, TypeScript a fondo 134, Arquitectura de front 96, Diseño de sistemas 61."
        height={220}
        data={COURSES}
        series={[{ key: 'alumnos', label: 'Alumnos' }]}
        xKey="course"
        orientation="horizontal"
      />
      <Note>
        `orientation` is named for what you see: `horizontal` lays the bars down. Recharts calls
        this same thing `layout=&quot;vertical&quot;`, and settling the inversion here is the point
        of the prop.
      </Note>
      <Note>
        The value axis is hidden. A ranking is read by comparing lengths; the number is in the
        tooltip.
      </Note>
    </div>
  ),
};

export const Lines: Story = {
  render: () => (
    <div>
      <LineChart
        label="Matrículas nuevas y bajas por mes, de enero a junio"
        summary="Las nuevas suben de 24 a 52 y las bajas se mueven entre 3 y 8."
        height={260}
        data={ENROLLMENTS}
        series={SERIES}
        xKey="month"
      />
      <Note>
        The type that adds nothing up. Four filled areas stacked are a total; four lines are four
        things you can tell apart.
      </Note>
      <Note>
        The grid is `hairline` and the ticks are `plankton` in mono, not Recharts&rsquo; default
        greys, which are not part of this identity.
      </Note>
    </div>
  ),
};

/* ------------------------------------------------------------ the chassis */

/**
 * What the three types do not cover, composed by hand on the same chassis.
 *
 * A doughnut is not a series over a category axis, so it has no type of its own
 * and it is not missing one: `ChartContainer` and `ChartTooltip` are the layer
 * that matters, and Recharts&rsquo; own `Pie` is the rest.
 */
export const Palette: Story = {
  name: 'The four series',
  render: () => (
    <div>
      <ChartContainer
        label="Reparto de visitas por origen"
        summary="Directo 42 %, buscador 31 %, newsletter 18 %, redes 9 %."
        height={280}
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={SOURCES} dataKey="value" nameKey="source" innerRadius={60} isAnimationActive={false}>
            {SOURCES.map((item, i) => (
              <Cell key={item.source} fill={seriesColor(i)} stroke="none" />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <Block title="the palette, in order">
        <ul className="gap-step-sm flex flex-wrap items-center">
          {SERIES_COLORS.map((color, i) => (
            <li key={color} className="gap-step-xs flex items-center">
              <span
                aria-hidden="true"
                className="rounded-chip border-hairline size-6 border"
                style={{ backgroundColor: color }}
              />
              <span className="font-mono text-chip text-text-muted">series-{i + 1}</span>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="why four">
        <Note>
          Teal, orange, blue and grey: they are told apart by HUE, not by lightness, which is the
          only way they stay four distinct series for someone who cannot tell red from green.
        </Note>
        <Note>
          `seriesColor` wraps around past the fourth, and two series sharing a color is the correct
          signal: the chart has more categories than this identity can tell apart, and what to do is
          group them into «otros».
        </Note>
      </Block>
    </div>
  ),
};
