import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import { Button } from './button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from './popover.tsx';
import { Text } from './typography.tsx';

const meta = { title: 'Primitivos/Popover', component: Popover } satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

const globo = (args: Parameters<NonNullable<Story['render']>>[0]) => (
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

export const Cerrado: Story = { render: globo };

export const Abierto: Story = {
  parameters: {
    // Mismo desacuerdo conocido entre axe y Radix que en Select y DropdownMenu:
    // el disparador queda dentro de la región marcada aria-hidden aunque el foco
    // esté atrapado en el portal.
    a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } },
  },
  render: globo,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Cómo se calcula' }));
  },
};
