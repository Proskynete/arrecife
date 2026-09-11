import { Star } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { Icon } from '../../icons/index.tsx';
import { Badge } from '../../primitives/badge.tsx';
import { Text } from '../../primitives/typography.tsx';
import { CourseCard } from './index.tsx';

const meta = {
  title: 'Components/CourseCard',
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

/**
 * A stand-in for the project's cover. The real one is an image pipeline the
 * library does not own — `next/image`, a generated cover — so the story draws a
 * block at the ratio `cursos` uses and says so.
 */
function CoverPlaceholder() {
  return (
    <div aria-hidden="true" className="bg-surface-raised flex aspect-video items-center justify-center">
      <Text variant="meta" tone="secondary" as="span">
        portada · 16:9
      </Text>
    </div>
  );
}

/** The closing row `cursos` sells a course with: the rating on the left, the price on the right. */
function RatingAndPrice() {
  return (
    <>
      <Text variant="label" tone="secondary" as="span" className="gap-step-xs flex items-center">
        <Icon as={Star} tone="quiet" />
        4,8 · 126 reseñas
      </Text>
      <Badge variant="accent">$29.990 CLP</Badge>
    </>
  );
}

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

export const WithMediaAndFooter: Story = {
  name: 'With media and footer',
  render: (args) => (
    <div className="max-w-content">
      <CourseCard {...args} media={<CoverPlaceholder />} footer={<RatingAndPrice />} />
      <Note>
        `media` bleeds to the edges and the card rounds its corners. The title
        stays in the body, not over the cover: text on a photograph needs a scrim
        whose contrast depends on the photograph, and contrast in this system is
        measured, not estimated. `footer` is the project&apos;s — the price comes in a
        currency the library does not know — and it sits at the bottom of the card.
      </Note>
    </div>
  ),
};

export const MediaHover: Story = {
  name: 'With media · hover',
  parameters: { pseudo: { hover: true } },
  render: (args) => (
    <div className="max-w-content">
      <CourseCard {...args} media={<CoverPlaceholder />} footer={<RatingAndPrice />} />
      <Note>
        Rule 6: the border changes and the title takes the accent. The cover does
        not zoom and nothing moves.
      </Note>
    </div>
  ),
};

export const MediaFocus: Story = {
  name: 'With media · focus',
  parameters: { pseudo: { focusVisible: true } },
  render: (args) => (
    <div className="max-w-content p-step-sm">
      <CourseCard {...args} media={<CoverPlaceholder />} />
      <Note>
        The card clips the cover with `overflow-hidden`, and the ring still shows:
        it is an outline outside the card, and overflow clips what is inside.
      </Note>
    </div>
  ),
};

export const Grid: Story = {
  name: 'Grid · the footers line up',
  render: (args) => (
    <div className="gap-step-md grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
      <CourseCard {...args} media={<CoverPlaceholder />} footer={<RatingAndPrice />} />
      <CourseCard
        {...args}
        title="TypeScript a fondo"
        summary="Tipos que documentan."
        media={<CoverPlaceholder />}
        footer={<RatingAndPrice />}
      />
      <CourseCard
        {...args}
        title="Construir con IA"
        status="próximamente"
        media={<CoverPlaceholder />}
        footer={<Badge variant="neutral">Gratis</Badge>}
      />
      <CourseCard {...args} title="Diseño de sistemas" progress={62} media={<CoverPlaceholder />} />
    </div>
  ),
};
