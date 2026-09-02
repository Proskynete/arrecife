import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note, Stack } from '../../stories/utils.tsx';
import { Separator } from './separator.tsx';
import { Text } from './typography.tsx';

const meta = { title: 'Primitives/Separator', component: Separator } satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <Stack>
      <Text variant="ui">Charlas</Text>
      <Separator />
      <Text variant="ui">Cursos</Text>
      <Separator />
      <Text variant="ui">Escritos</Text>
      <Note>
        It uses `hairline`, not `border`: a division between pieces of content is
        subtle by definition. `border` is for delimiting a control.
      </Note>
    </Stack>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="gap-step-sm flex h-8 items-center">
      <Text variant="label" tone="secondary">2025</Text>
      <Separator orientation="vertical" />
      <Text variant="label" tone="secondary">8 min</Text>
      <Separator orientation="vertical" />
      <Text variant="label" tone="secondary">arquitectura</Text>
    </div>
  ),
};
