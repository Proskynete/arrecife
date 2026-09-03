import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { ArrowUpRight, Check, Ellipsis } from '../../lib/glyphs.tsx';
import { Stat } from './index.tsx';

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
