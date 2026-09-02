import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { CourseCard } from './index.tsx';

const meta = {
  title: 'Components/CourseCard',
  component: CourseCard,
  args: {
    href: '#',
    title: 'Arquitectura frontend para equipos que crecen',
    summary:
      'Cómo sostener una base de código when el equipo passes de tres a treinta, sin reescribirla dos veces por el camino.',
    meta: ['18 lecciones', '6 h 40 min', 'Intermedio'],
  },
} satisfies Meta<typeof CourseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div className="max-w-content"><CourseCard {...args} /></div>,
};

export const WithStatus: Story = {
  name: 'With status',
  args: { status: 'próximamente' },
  render: (args) => <div className="max-w-content"><CourseCard {...args} /></div>,
};

export const InProgress: Story = {
  name: 'In progress',
  args: { progress: 45 },
  render: (args) => (
    <div className="max-w-content">
      <CourseCard {...args} />
      <Note>
        The bar is sand, not biolume: course progress is one of the places where
        the system uses the human color.
      </Note>
    </div>
  ),
};
