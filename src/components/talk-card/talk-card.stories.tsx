import type { Meta, StoryObj } from '@storybook/react-vite';

import { TalkCard } from './index.tsx';

const meta = {
  title: 'Componentes/TalkCard',
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

export const Rejilla: Story = {
  render: (args) => (
    <div className="gap-step-md grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
      <TalkCard {...args} />
      <TalkCard {...args} title="Deuda técnica con nombre y apellido" event="NerdearLA" date="Octubre 2024" dateTime="2024-10" location="Buenos Aires" status={undefined} />
      <TalkCard {...args} title="Decisiones documentadas" event="Interno" date="Próxima" dateTime="2026-03" location={undefined} status="próxima" />
    </div>
  ),
};
