import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
import { ArticleCard } from './index.tsx';

const meta = {
  title: 'Componentes/ArticleCard',
  component: ArticleCard,
  args: {
    href: '#',
    title: 'Deuda técnica con nombre y apellido',
    excerpt:
      'Llamarla «deuda técnica» la vuelve de nadie. Cuando cada atajo tiene una fecha y una persona detrás, la conversación cambia de tono.',
    date: '14 de marzo de 2025',
    dateTime: '2025-03-14',
    readingMinutes: 8,
    tags: ['arquitectura', 'equipos'],
  },
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div className="max-w-content"><ArticleCard {...args} /></div>,
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: (args) => (
    <div className="max-w-content">
      <ArticleCard {...args} />
      <Nota>
        El hover cambia el borde de `hairline` a `hairlineHover` y tiñe el título
        de acento. Nada más: ni escala, ni elevación, ni desplazamiento.
      </Nota>
    </div>
  ),
};

export const Rejilla: Story = {
  render: (args) => (
    <div className="gap-step-md grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
      <ArticleCard {...args} />
      <ArticleCard
        {...args}
        title="Arquitecturas que sobreviven al equipo que las escribió"
        excerpt="Una decisión sin escribir es una decisión que se vuelve a tomar cada seis meses, peor cada vez."
        readingMinutes={12}
        tags={['adr']}
      />
      <ArticleCard {...args} title="Sin entradilla ni etiquetas" excerpt={undefined} tags={undefined} />
    </div>
  ),
};
