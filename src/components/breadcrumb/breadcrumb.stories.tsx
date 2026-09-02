import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { Breadcrumb } from './index.tsx';

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: [
      { label: 'artículos', href: '/articulos' },
      { label: 'como-escalar-un-equipo-sin-romperlo' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: 'Basic',
  render: (args) => (
    <>
      <Breadcrumb {...args} />
      <Note>
        The `~` is the filesystem's home, not a house icon: which is why the whole
        path goes in mono. The separators use `border`, the faintest token that
        still reads as a line.
      </Note>
      <Note>
        The last crumb is the current page, so it is not a link and it carries
        `aria-current="page"`. The `~` carries an `aria-label`, otherwise a screen
        reader announces a stray tilde.
      </Note>
    </>
  ),
};

export const Deep: Story = {
  args: {
    items: [
      { label: 'cursos', href: '/cursos' },
      { label: 'arquitectura-frontend', href: '/cursos/arquitectura-frontend' },
      { label: 'modulo-3' },
    ],
  },
};
