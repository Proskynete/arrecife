import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from 'recharts';

import { Bloque, Nota } from '../../stories/utils.tsx';
import {
  COLORES_DE_SERIE,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  colorDeSerie,
} from './index.tsx';

const meta = {
  title: 'Gráficas/Chart',
  component: ChartContainer,
  // `label` y `children` son obligatorios en el tipo: sin ellos el meta no
  // compila, que es exactamente lo que se quiere de un nombre accesible.
  args: { label: 'Gráfica de ejemplo', children: <div /> },
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const MATRICULAS = [
  { mes: 'ene', nuevas: 24, bajas: 4 },
  { mes: 'feb', nuevas: 31, bajas: 6 },
  { mes: 'mar', nuevas: 28, bajas: 3 },
  { mes: 'abr', nuevas: 44, bajas: 7 },
  { mes: 'may', nuevas: 39, bajas: 5 },
  { mes: 'jun', nuevas: 52, bajas: 8 },
];

const FUENTES = [
  { fuente: 'Directo', valor: 42 },
  { fuente: 'Buscador', valor: 31 },
  { fuente: 'Newsletter', valor: 18 },
  { fuente: 'Redes', valor: 9 },
];

export const Barras: Story = {
  render: () => (
    <div>
      <ChartContainer
        label="Matrículas nuevas y bajas por mes, de enero a junio"
        summary="Enero 24 nuevas y 4 bajas; febrero 31 y 6; marzo 28 y 3; abril 44 y 7; mayo 39 y 5; junio 52 y 8."
      >
        <BarChart data={MATRICULAS}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="mes" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={32} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="nuevas" name="Nuevas" fill={colorDeSerie(0)} radius={4} isAnimationActive={false} />
          <Bar dataKey="bajas" name="Bajas" fill={colorDeSerie(1)} radius={4} isAnimationActive={false} />
        </BarChart>
      </ChartContainer>

      <Nota>
        Los colores salen de `tokens.series` como `var(--color-serie-N)`, no como
        hexadecimal leído en JS: así siguen el modo. Cambia el tema en la barra de
        arriba y la gráfica cambia con él, sin remontarse.
      </Nota>
      <Nota>
        `label` es obligatorio, como en `Progress`. El `svg` va `aria-hidden` y lo
        que se lee es la etiqueta y el `summary`: anunciar cada tick de un eje no
        cuenta lo que la gráfica cuenta.
      </Nota>
      <Nota>
        El tooltip aparece donde va a quedarse. `isAnimationActive` va apagado en
        el contenedor y en cada serie.
      </Nota>
    </div>
  ),
};

export const Lineas: Story = {
  name: 'Líneas',
  render: () => (
    <div>
      <ChartContainer
        label="Matrículas nuevas por mes, de enero a junio"
        summary="Sube de 24 en enero a 52 en junio, con una caída en mayo."
        height={260}
      >
        <LineChart data={MATRICULAS}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="mes" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={32} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            dataKey="nuevas"
            name="Nuevas"
            stroke={colorDeSerie(0)}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
      <Nota>
        La rejilla es `hairline` y los ticks son `plancton` en mono, no los grises
        por defecto de Recharts, que no son de esta identidad.
      </Nota>
    </div>
  ),
};

export const Paleta: Story = {
  name: 'Las cuatro series',
  render: () => (
    <div>
      <ChartContainer
        label="Reparto de visitas por fuente"
        summary="Directo 42 %, buscador 31 %, newsletter 18 %, redes 9 %."
        height={280}
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={FUENTES} dataKey="valor" nameKey="fuente" innerRadius={60} isAnimationActive={false}>
            {FUENTES.map((f, i) => (
              <Cell key={f.fuente} fill={colorDeSerie(i)} stroke="none" />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <Bloque titulo="la paleta, en orden">
        <ul className="gap-step-sm flex flex-wrap items-center">
          {COLORES_DE_SERIE.map((color, i) => (
            <li key={color} className="gap-step-xs flex items-center">
              <span
                aria-hidden="true"
                className="rounded-chip border-hairline size-6 border"
                style={{ backgroundColor: color }}
              />
              <span className="font-mono text-chip text-text-muted">serie-{i + 1}</span>
            </li>
          ))}
        </ul>
      </Bloque>

      <Bloque titulo="por qué cuatro">
        <Nota>
          Turquesa, naranja, azul y gris: se distinguen por TONO, no por
          luminosidad, que es la única forma de que sigan siendo cuatro series
          para quien no distingue rojo y verde.
        </Nota>
        <Nota>
          `colorDeSerie` da la vuelta pasada la cuarta, y que dos series compartan
          color es la señal correcta: la gráfica tiene más categorías de las que
          esta identidad sabe distinguir, y lo que toca es agrupar en «otros».
        </Nota>
      </Bloque>
    </div>
  ),
};
