import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.tsx';

const meta = { title: 'Primitives/Tooltip', component: Tooltip } satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

const track = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <TooltipProvider>
    <div className="py-step-xl flex justify-center">
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="secondary">Retroceder 15s</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Flecha izquierda</TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
);

export const Closed: Story = { render: track };
export const Open: Story = { args: { open: true }, render: track };
