import type { Meta, StoryObj } from '@storybook/react-vite';

import { FieldLabel, Stack } from '../../stories/utils.tsx';
import { Textarea } from './textarea.tsx';

const meta = {
  title: 'Primitives/Textarea',
  component: Textarea,
  args: { placeholder: 'Cuéntame en qué estás' },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

const withLabel = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <Stack>
    <div className="gap-step-xs flex flex-col">
      <FieldLabel htmlFor="message">Mensaje</FieldLabel>
      <Textarea id="message" {...args} />
    </div>
  </Stack>
);

export const Default: Story = { render: withLabel };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: withLabel };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: withLabel };
export const Invalid: Story = { name: 'Invalid', args: { invalid: true }, render: withLabel };
export const Disabled: Story = { args: { disabled: true }, render: withLabel };
