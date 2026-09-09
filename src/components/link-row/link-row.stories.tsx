import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowUpRight } from '@phosphor-icons/react';

import { Note } from '../../../stories/utils.tsx';
import { Icon } from '../../icons/index.tsx';
import { LinkRow } from './index.tsx';

const meta = {
  title: 'Components/LinkRow',
  component: LinkRow,
  args: { href: '#', name: 'GitHub', description: 'github.com/Proskynete', external: true },
} satisfies Meta<typeof LinkRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = {
  render: (args) => (
    <div className="gap-step-xs max-w-content flex flex-col">
      <LinkRow {...args} />
      <LinkRow {...args} name="LinkedIn" description="in/eduardo-alvarez" />
      <LinkRow {...args} name="Cursos" description="cursos.eduardoalvarez.dev" icon={<Icon as={ArrowUpRight}  />} />
      <LinkRow {...args} name="Sin descripción" description={undefined} external={false} />
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: (args) => (
    <div className="max-w-content">
      <LinkRow {...args} />
      <Note>
        The original in `links` scaled the card to 102 %, lifted the title by a
        pixel and rotated and enlarged the icon. Here the hover changes the border
        and the color, and nothing else.
      </Note>
    </div>
  ),
};
