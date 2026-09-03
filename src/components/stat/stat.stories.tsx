import type { Meta, StoryObj } from '@storybook/react-vite';

import { Block, Note } from '../../../stories/utils.tsx';
import { ArrowUpRight, Check, Ellipsis } from '../../lib/glyphs.tsx';
import { Stat } from './index.tsx';

/**
 * The project's sparkline, drawn HERE. `spark` is a `ReactNode` precisely so the
 * charting library stays out of the barrel that four projects install, and a
 * story that imported one would be arguing the opposite.
 *
 * Seven points, no axes, no tooltip. `currentColor` and `preserveAspectRatio`
 * set to none so it stretches to the card without the stroke thickening.
 */
function Spark({ points }: { points: readonly number[] }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const d = points
    .map((n, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 24 - ((n - min) / span) * 24;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      viewBox="0 0 100 24"
      preserveAspectRatio="none"
      className="text-accent h-6 w-full"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} fill="none" stroke="currentColor" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const meta = {
  title: 'Components/Stat',
  component: Stat,
  args: { value: '12', label: 'aplicaciones' },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Metrics: Story = {
  name: 'Talk metrics',
  render: () => (
    <>
      <div className="gap-step-md grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        <Stat value="12" label="aplicaciones" />
        <Stat value="4h 20m" label="duración" />
        <Stat value="0" label="design system" tone="alert" />
      </div>
      <Note>
        The rule is not one of style, it is one of semantics: biolume for the
        neutral and sand ONLY when the number is the problem. A 12 of applications
        is a datum; a 0 of design systems is the problem the talk is about. Which
        is why `tone` has two values and not an open palette.
      </Note>
    </>
  ),
};

export const WithProgress: Story = {
  name: 'With progress',
  render: () => (
    <div className="gap-step-md grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
      <Stat value="38%" label="progress del curso" progress={38} />
    </div>
  ),
};

export const WithIconAndDeck: Story = {
  name: 'With icon and standfirst',
  render: () => (
    <div className="gap-step-md grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
      <Stat
        icon={<ArrowUpRight />}
        label="aplicaciones"
        value="12"
        description="Repartidas en cuatro equipos, ninguno con dueño declarado."
      />
      <Stat
        icon={<Ellipsis />}
        label="design systems"
        value="0"
        tone="alert"
        description="Cada aplicación resuelve sus botones por su cuenta."
      />
      <Stat
        icon={<Check />}
        label="cobertura"
        value="68%"
        progress={68}
        description="Sube diez puntos desde el trimestre pasado."
      />
    </div>
  ),
};

export const ReadingOrder: Story = {
  name: 'Why the number goes in the middle',
  render: () => (
    <div className="max-w-content">
      <Stat
        icon={<ArrowUpRight />}
        label="aplicaciones"
        value="12"
        description="Repartidas en cuatro equipos, ninguno con dueño declarado."
      />
      <Note>
        The top says what it is about, the middle how much, the bottom the nuance.
        The number does not go at the end on purpose: it is what people came to
        read, and a two-line standfirst between the title and the figure buries it.
      </Note>
      <Note>
        The icon inherits `currentColor`, so it follows the title's tone and does
        not have to be tinted separately. It comes from `lib/glyphs.tsx`, which is
        not published: the project passes its own.
      </Note>
    </div>
  ),
};

export const WithDelta: Story = {
  name: 'With a delta',
  render: () => (
    <>
      <div className="gap-step-md grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        <Stat
          label="alumnos"
          value="1.284"
          delta={{ value: '+12 esta semana', direction: 'up' }}
        />
        <Stat
          label="errores 5xx"
          value="37"
          tone="alert"
          delta={{ value: '+9 esta semana', direction: 'up' }}
        />
        <Stat
          label="tiempo de respuesta"
          value="240 ms"
          delta={{ value: 'sin cambio', direction: 'flat' }}
        />
      </div>
      <Note>
        The two on the left point the SAME way and mean opposite things. That is
        why `direction` picks the glyph and never the colour: a rise is not
        automatically good, and whether the number matters is what `tone` already
        says. The arrow is not the only channel either — the glyph is
        `aria-hidden` and «sube», «baja» or «sin cambio» goes to the screen reader
        in its place.
      </Note>
      <Note>
        `delta.value` arrives already formatted, like `value`. The library imposes
        no locale and does not compute a percentage.
      </Note>
    </>
  ),
};

export const WithSpark: Story = {
  name: 'With a sparkline',
  render: () => (
    <>
      <div className="gap-step-md grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        <Stat
          label="inscripciones"
          value="312"
          delta={{ value: '+18 esta semana', direction: 'up' }}
          spark={<Spark points={[4, 6, 5, 9, 8, 12, 15]} />}
        />
        <Stat
          label="lecciones vistas"
          value="8.940"
          delta={{ value: '−240 esta semana', direction: 'down' }}
          spark={<Spark points={[15, 14, 16, 12, 11, 9, 8]} />}
        />
      </div>
      <Note>
        `spark` is a `ReactNode` and not a data prop, and the story draws its own
        rather than importing one. A sparkline needs a charting library; this
        component lives in the barrel that all four projects install, and only one
        of them draws them. Same contract as `icon`.
      </Note>
    </>
  ),
};

export const Tones: Story = {
  name: 'The three tones',
  render: () => (
    <>
      <Block title="neutral · a datum">
        <div className="gap-step-md grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          <Stat label="aplicaciones" value="12" />
        </div>
      </Block>

      <Block title="alert · the number IS the problem">
        <div className="gap-step-md grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          <Stat label="design systems" value="0" tone="alert" />
        </div>
      </Block>

      <Block title="achievement · the number is the opposite of a problem">
        <div className="gap-step-md grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          <Stat label="diplomas emitidos" value="248" tone="achievement" />
        </div>
      </Block>

      <Note>
        `alert` and `achievement` paint the SAME sand, and they are still two
        names. A counter of diplomas is not an alert — it is the opposite — and
        painting it with `alert` gets the colour right and the meaning wrong,
        which is precisely what a system that names by meaning should not let you
        do. See `docs/decisions.md` § 28.
      </Note>
      <Note>
        Neither of them is `success`. In light mode `success` and `accent` are two
        nearly identical greens, which is the reason the chart palette skips
        `success` too — and the manual already assigns sand to celebration in
        `cursos`.
      </Note>
    </>
  ),
};
