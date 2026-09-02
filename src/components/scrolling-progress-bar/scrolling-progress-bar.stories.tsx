import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { Text } from '../../primitives/typography.tsx';
import { ScrollingProgressBar } from './index.tsx';

const meta = {
  title: 'Components/ScrollingProgressBar',
  component: ScrollingProgressBar,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ScrollingProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const PARAGRAPHS = 12;

function Article() {
  return (
    <div className="gap-step-md max-w-content mx-auto flex flex-col">
      <Text as="h1" variant="h1">
        Escalar con criterio
      </Text>
      {Array.from({ length: PARAGRAPHS }, (_, i) => (
        <Text key={i} variant="body">
          Párrafo {i + 1}. Un equipo que crece sin criterio no se rompe por la
          arquitectura: se rompe por las decisiones que nadie escribió y que cada
          quien reconstruye distinto. La barra de arriba mide cuánto queda de
          esto, no cuánto falta para que algo termine.
        </Text>
      ))}
    </div>
  );
}

export const Basic: Story = {
  name: 'Basic',
  render: (args) => (
    <div className="-m-step-lg">
      <ScrollingProgressBar {...args} />
      <div className="p-step-lg">
        <Note>
          It is `aria-hidden`. A screen reader already knows where it is in the
          document; announcing «37 %» on every movement is noise. What is purely
          visual is declared as such.
        </Note>
        <Note>
          The width does not transition: `transition-standard` only covers color
          and border, so the bar follows the scroll instead of chasing it.
        </Note>
        <Article />
      </div>
    </div>
  ),
};

/** El caso real: la barra sigue al artículo, no al documento. */
function WithScopedArticle() {
  const article = useRef<HTMLElement>(null);

  return (
    <div className="-m-step-lg">
      <ScrollingProgressBar target={article} />
      <div className="p-step-lg gap-step-xl flex flex-col">
        <Note>
          With a tall header and a footer full of links, measuring the whole
          document hits 100 % while two paragraphs are still left. `target` scopes
          the measurement to the article.
        </Note>
        <article ref={article}>
          <Article />
        </article>
        <Note>Everything down here no longer counts towards the bar.</Note>
      </div>
    </div>
  );
}

export const WithTarget: Story = {
  name: 'Measuring the article only',
  render: () => <WithScopedArticle />,
};

export const Sand: Story = {
  name: 'Sand tone',
  args: { tone: 'warm' },
  render: (args) => (
    <div className="-m-step-lg">
      <ScrollingProgressBar {...args} />
      <div className="p-step-lg">
        <Note>
          Sand for a course lesson, which is where reading progress and course
          progress share a screen and had better speak the same color.
        </Note>
        <Article />
      </div>
    </div>
  ),
};
