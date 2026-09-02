import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { TalkCard } from './index.tsx';

const meta = {
  title: 'Components/TalkCard',
  component: TalkCard,
  args: {
    href: '#',
    title: 'Escalar sin romper el equipo',
    event: 'JSConf',
    date: 'Mayo 2025',
    dateTime: '2025-05',
    location: 'Santiago',
    status: 'con vídeo',
  },
} satisfies Meta<typeof TalkCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div className="max-w-content"><TalkCard {...args} /></div>,
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: (args) => <div className="max-w-content"><TalkCard {...args} /></div>,
};

export const Grid: Story = {
  render: (args) => (
    <div className="gap-step-md grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
      <TalkCard {...args} />
      <TalkCard {...args} title="Deuda técnica con nombre y apellido" event="NerdearLA" date="Octubre 2024" dateTime="2024-10" location="Buenos Aires" status={undefined} />
      <TalkCard {...args} title="Decisiones documentadas" event="Interno" date="Próxima" dateTime="2026-03" location={undefined} status="próxima" />
    </div>
  ),
};

export const WithDescription: Story = {
  name: 'With description',
  args: {
    description:
      'Qué se rompe when un equipo passes de ocho a treinta, por qué casi nunca es la arquitectura, y las tres decisiones que conviene write antes de que haga falta.',
  },
  render: (args) => (
    <div className="max-w-content">
      <TalkCard {...args} />
      <Note>
        The description clamps to two lines, same as `ArticleCard`'s `excerpt`: the
        talks grid has to stay aligned even when one talk explains itself in twice
        as many words as the one beside it.
      </Note>
      <Note>
        Without this slot, migrating the portfolio's talk listing was not a change
        of style: it LOST content. Which is why that project stuck with its own
        markup.
      </Note>
    </div>
  ),
};
