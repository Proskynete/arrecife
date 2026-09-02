import type { Meta, StoryObj } from '@storybook/react-vite';

import { Block, Note, Stack } from '../../stories/utils.tsx';
import { Progress } from './progress.tsx';

const meta = {
  title: 'Primitives/Progress',
  component: Progress,
  args: { value: 45, label: 'Progreso del curso' },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <Stack><Progress {...args} /></Stack> };

export const Scale: Story = {
  render: () => (
    <Stack>
      {[0, 25, 50, 75, 100].map((v) => (
        <Block key={v} title={`${v}%`}>
          <Progress value={v} label={`Progreso del curso: ${v}%`} />
        </Block>
      ))}
    </Stack>
  ),
};

export const Sand: Story = {
  render: (args) => (
    <Stack>
      <Progress {...args} tone="warm" />
      <Note>
        Sand for course progress, which is human and is conversion. Biolume for
        everything else.
      </Note>
    </Stack>
  ),
};
