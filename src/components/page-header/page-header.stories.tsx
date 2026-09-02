import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { Button } from '../../primitives/button.tsx';
import { tagline } from '../../tokens/tokens.ts';
import { PageHeader } from './index.tsx';

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['display', 'page'],
      description: 'display for covers, page for section headers.',
      table: { defaultValue: { summary: 'page' } },
    },
    as: { control: 'inline-radio', options: ['h1', 'h2'] },
  },
  parameters: { layout: 'padded' },
  // It goes inside `<main>`: outside it would become a `banner` landmark and
  // clash with the site header.
  decorators: [
    (Story) => (
      <main>
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cover: Story = {
  args: {
    size: 'display',
    eyebrow: 'start',
    title: tagline.long,
    description:
      'Trabajo con equipos que crecieron más rápido que su arquitectura. Empiezo por leer el código y terminar hablando con quien lo escribió.',
  },
  render: (args) => (
    <>
      <PageHeader
        {...args}
        action={
          <>
            <Button variant="conversion">Agenda una llamada</Button>
            <Button variant="secondary">Ver el trabajo</Button>
          </>
        }
      />
      <Note>
        The headline comes from the `tagline.long` token, not from a hand-written
        string: the wordmark and the phrase live in `tokens.ts` so they do not fork
        between projects. The `action` slot carries the screen's only conversion
        button.
      </Note>
    </>
  ),
};

export const Section: Story = {
  name: 'Section header',
  args: {
    size: 'page',
    eyebrow: 'artículos',
    title: 'Escritos sobre arquitectura y equipos',
    description:
      'Notas largas sobre decisiones que costaron caro. Sin listas de diez trucos.',
  },
};

export const NoEyebrow: Story = {
  name: 'No eyebrow, no description',
  args: { size: 'page', title: 'Contacto' },
};

export const TwoScales: Story = {
  name: 'The two scales',
  args: { title: 'Escalar con criterio' },
  render: () => (
    <div className="gap-step-lg flex flex-col">
      <PageHeader size="display" eyebrow="portada" title="Escalar con criterio" as="h1" />
      <PageHeader size="page" eyebrow="sección" title="Escalar con criterio" as="h2" />
      <Note>
        The same skeleton at 76 and at 44 pixels. They used to be two components,
        `Hero` and `PageHeader`, with the same rule written twice.
      </Note>
    </div>
  ),
};
