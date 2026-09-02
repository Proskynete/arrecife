import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { ArrowUpRight } from '../../lib/glyphs.tsx';
import { Button } from '../../primitives/button.tsx';
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
      'Qué se rompe cuando un equipo pasa de ocho a treinta, por qué casi nunca es la arquitectura, y las tres decisiones que conviene escribir antes de que hagan falta.',
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

export const WithResources: StoryObj = {
  name: 'With resources',
  render: () => (
    <div className="max-w-content">
      <TalkCard
        title="Escalar sin romper el equipo"
        event="JSConf"
        date="Mayo 2025"
        dateTime="2025-05"
        location="Santiago"
        status="con vídeo"
        description="Qué se rompe cuando un equipo pasa de ocho a treinta, y las tres decisiones que conviene escribir antes de que hagan falta."
        resources={
          <>
            <Button asChild variant="tertiary" size="sm" icon={<ArrowUpRight />}>
              <a href="#slides">./slides</a>
            </Button>
            <Button asChild variant="tertiary" size="sm" icon={<ArrowUpRight />}>
              <a href="#repo">./repo</a>
            </Button>
            <Button asChild variant="tertiary" size="sm" icon={<ArrowUpRight />}>
              <a href="#video">./vídeo</a>
            </Button>
          </>
        }
      />
      <Note>
        With resources the card stops being a link, and that is not a style
        choice: an `a` inside an `a` is invalid HTML and the browser un-nests it.
        The type enforces it — passing `href` and `resources` together does not
        compile.
      </Note>
      <Note>
        Before this, the listing pointed the whole card at the first resource that
        existed — slides, else repo, else the event site — which hid the rest and
        left a card whose destination it never announced.
      </Note>
      <Note>
        The resources carry `mt-auto`, so in a grid every card lines its links up
        at the same height however long the description is.
      </Note>
    </div>
  ),
};
