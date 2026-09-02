import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { ArticleCard } from './index.tsx';

const meta = {
  title: 'Components/ArticleCard',
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
      <Note>
        The hover changes the border from `hairline` to `hairlineHover` and tints
        the title with accent. Nothing else: no scale, no elevation, no
        displacement.
      </Note>
    </div>
  ),
};

export const Grid: Story = {
  render: (args) => (
    <div className="gap-step-md grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
      <ArticleCard {...args} />
      <ArticleCard
        {...args}
        title="Arquitecturas que sobreviven al equipo que las escribió"
        excerpt="Una decisión sin write es una decisión que se vuelve a tomar cada seis meses, peor cada vez."
        readingMinutes={12}
        tags={['adr']}
      />
      <ArticleCard {...args} title="Sin entradilla ni etiquetas" excerpt={undefined} tags={undefined} />
    </div>
  ),
};

export const AsH2: Story = {
  name: 'headingLevel 2',
  args: { headingLevel: 2 },
  render: (args) => (
    <div className="max-w-content">
      <ArticleCard {...args} />
      <Note>
        `h3` by default: a lone card in a grid does not earn a level its position
        does not give it. On the listing page it does earn it — the cards ARE the
        section's main heading — and that intent was lost with a fixed level.
      </Note>
      <Note>
        Restricted to `2 | 3`. Opening it up to `h5` is an invitation to skip
        levels, which is the failure the constant was preventing.
      </Note>
    </div>
  ),
};
