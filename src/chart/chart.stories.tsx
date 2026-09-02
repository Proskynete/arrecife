import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from 'recharts';

import { Block, Note } from '../../stories/utils.tsx';
import {
  SERIES_COLORS,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  seriesColor,
} from './index.tsx';

const meta = {
  title: 'Charts/Chart',
  component: ChartContainer,
  // `label` y `children` son obligatorios en el kind: sin ellos el meta no
  // compila, que es exactamente lo que se quiere de un name accesible.
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

const FONTS = [
  { source: 'Directo', value: 42 },
  { source: 'Buscador', value: 31 },
  { source: 'Newsletter', value: 18 },
  { source: 'Redes', value: 9 },
];

export const Bars: Story = {
  render: () => (
    <div>
      <ChartContainer
        label="Matrículas nuevas y bajas por mes, de enero a junio"
        summary="Enero 24 nuevas y 4 bajas; febrero 31 y 6; marzo 28 y 3; abril 44 y 7; mayo 39 y 5; junio 52 y 8."
      >
        <BarChart data={ENROLLMENTS}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={32} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="nuevas" name="Nuevas" fill={seriesColor(0)} radius={4} isAnimationActive={false} />
          <Bar dataKey="bajas" name="Bajas" fill={seriesColor(1)} radius={4} isAnimationActive={false} />
        </BarChart>
      </ChartContainer>

      <Note>
        The colors come from `tokens.series` as `var(--color-series-N)`, not as a
        hexadecimal read in JS: that way they follow the mode. Switch the theme in
        the bar above and the chart changes with it, without remounting.
      </Note>
      <Note>
        `label` is mandatory, as in `Progress`. What gets read is the label and the
        `summary`: announcing every tick on an axis does not tell what the chart
        tells.
      </Note>
      <Note>
        The tooltip appears where it will stay. `isAnimationActive` is off on the
        container and on every series.
      </Note>
    </div>
  ),
};

export const Lines: Story = {
  name: 'Lines',
  render: () => (
    <div>
      <ChartContainer
        label="Matrículas nuevas por mes, de enero a junio"
        summary="Sube de 24 en enero a 52 en junio, con una caída en mayo."
        height={260}
      >
        <LineChart data={ENROLLMENTS}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={32} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            dataKey="nuevas"
            name="Nuevas"
            stroke={seriesColor(0)}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
      <Note>
        The grid is `hairline` and the ticks are `plankton` in mono, not Recharts'
        default greys, which are not part of this identity.
      </Note>
    </div>
  ),
};

export const Palette: Story = {
  name: 'The four series',
  render: () => (
    <div>
      <ChartContainer
        label="Reparto de visitas por origen"
        summary="Directo 42 %, buscador 31 %, newsletter 18 %, socialLinks 9 %."
        height={280}
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={FONTS} dataKey="value" nameKey="source" innerRadius={60} isAnimationActive={false}>
            {FONTS.map((f, i) => (
              <Cell key={f.source} fill={seriesColor(i)} stroke="none" />
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
          Teal, orange, blue and grey: they are told apart by HUE, not by
          lightness, which is the only way they stay four distinct series for
          someone who cannot tell red from green.
        </Note>
        <Note>
          `seriesColor` wraps around past the fourth, and two series sharing a
          color is the correct signal: the chart has more categories than this
          identity can tell apart, and what to do is group them into «otros».
        </Note>
      </Block>
    </div>
  ),
};
