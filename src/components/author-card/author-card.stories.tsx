import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note, Stack } from '../../../stories/utils.tsx';
import { Button } from '../../primitives/button.tsx';
import { AuthorCard } from './index.tsx';

const meta = {
  title: 'Components/AuthorCard',
  component: AuthorCard,
  args: { name: 'Eduardo Álvarez', role: 'Technical Lead · Chile' },
} satisfies Meta<typeof AuthorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: 'Basic',
  render: (args) => (
    <>
      <Stack>
        <AuthorCard {...args} />
      </Stack>
      <Note>
        Three data points: 52px avatar, name 15/500 and the role in muted mono. The
        role goes in mono because it is a datum — title and country — not a
        sentence.
      </Note>
      <Note>
        It takes no mascot face, and that is not an oversight: it is the same rule
        as `PageHeader`. A face here would be humour right where the reader is
        deciding whether the author knows what they are talking about.
      </Note>
    </>
  ),
};

export const WithBio: Story = {
  name: 'With bio and action',
  render: (args) => (
    <Stack>
      <AuthorCard
        {...args}
        bio="Trabajo con equipos que crecieron más rápido que su arquitectura. Escribo sobre liderazgo técnico, plataforma y la era de la IA."
        action={<Button variant="tertiary">./hablemos →</Button>}
      />
    </Stack>
  ),
};
