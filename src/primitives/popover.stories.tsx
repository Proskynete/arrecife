import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import { Button } from './button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from './popover.tsx';
import { Text } from './typography.tsx';

const meta = { title: 'Primitives/Popover', component: Popover } satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

const bubble = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <Popover {...args}>
    <PopoverTrigger asChild>
      <Button variant="secondary">Cómo se calcula</Button>
    </PopoverTrigger>
    <PopoverContent align="start" aria-label="Cómo se calcula el porcentaje">
      <Text variant="ui" tone="secondary">
        El porcentaje sale de las lecciones marcadas como completas sobre el total
        publicado, no sobre el total del temario.
      </Text>
    </PopoverContent>
  </Popover>
);

export const Closed: Story = { render: bubble };

export const Open: Story = {
  parameters: {
    // The same known disagreement between axe and Radix as in Select and
    // DropdownMenu: the trigger ends up inside the region marked aria-hidden even
    // though focus is trapped in the portal.
    a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } },
  },
  render: bubble,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Cómo se calcula' }));
  },
};
