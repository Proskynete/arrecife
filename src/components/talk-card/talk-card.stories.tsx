import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
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

export const ConDescripcion: Story = {
  name: 'Con descripción',
  args: {
    description:
      'Qué se rompe cuando un equipo pasa de ocho a treinta, por qué casi nunca es la arquitectura, y las tres decisiones que conviene escribir antes de que haga falta.',
  },
  render: (args) => (
    <div className="max-w-content">
      <TalkCard {...args} />
      <Nota>
        La descripción se corta a dos líneas, igual que el `excerpt` de
        `ArticleCard`: la rejilla de charlas tiene que seguir alineada aunque una
        charla se explique en el doble de palabras que la de al lado.
      </Nota>
      <Nota>
        Sin esta ranura, migrar el listado de charlas del portafolio no era un
        cambio de estilo: PERDÍA contenido. Por eso ese proyecto seguía con su
        propio marcado.
      </Nota>
    </div>
  ),
};
