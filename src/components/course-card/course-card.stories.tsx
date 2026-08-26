import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
import { CourseCard } from './index.tsx';

const meta = {
  title: 'Componentes/CourseCard',
  component: CourseCard,
  args: {
    href: '#',
    title: 'Arquitectura frontend para equipos que crecen',
    summary:
      'Cómo sostener una base de código cuando el equipo pasa de tres a treinta, sin reescribirla dos veces por el camino.',
    meta: ['18 lecciones', '6 h 40 min', 'Intermedio'],
  },
} satisfies Meta<typeof CourseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div className="max-w-content"><CourseCard {...args} /></div>,
};

export const ConEstado: Story = {
  name: 'Con estado',
  args: { status: 'próximamente' },
  render: (args) => <div className="max-w-content"><CourseCard {...args} /></div>,
};

export const EnProgreso: Story = {
  name: 'En progreso',
  args: { progress: 45 },
  render: (args) => (
    <div className="max-w-content">
      <CourseCard {...args} />
      <Nota>
        La barra va en arena, no en bioluz: el progreso de curso es de los sitios
        donde el sistema usa el color humano.
      </Nota>
    </div>
  ),
};
