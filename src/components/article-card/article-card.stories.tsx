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

export const TagAnchors: Story = {
  name: 'Reaching the tags from a test',
  args: {
    tags: ['engineering-culture', 'career-strategy'],
    tagAsChild: ({ tag, children }) => <span data-testid={`tag-${tag}`}>{children}</span>,
  },
  render: (args) => (
    <div className="max-w-content">
      <ArticleCard {...args} />
      <Note>
        The tags were the one composed part a project could not get at: they
        arrive as strings and the component turns them into badges, so a suite had
        to select them by structure — `article {'>'} div {'>'} span` — or by a style
        class. The second already broke the blog's suite once, because a style
        class is not a contract: it changes when the style changes.
      </Note>
      <Note>
        `tagAsChild` hands over the element and its attributes and nothing else.
        The classes and the rule stay in the library — a tag is a category pill,
        and that does not become negotiable. Inspect one: it still carries the
        pill's classes, plus the `data-testid`.
      </Note>
      <Note>
        It is the shape `linkAsChild` already has in `Breadcrumb` and
        `TableOfContents`, on purpose: one idiom for «the project supplies the
        element, the library supplies the styling», rather than a second one that
        does the same thing under another name.
      </Note>
    </div>
  ),
};
