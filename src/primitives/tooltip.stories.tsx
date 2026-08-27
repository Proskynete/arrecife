import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.tsx';

const meta = { title: 'Primitivos/Tooltip', component: Tooltip } satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

const pista = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <TooltipProvider>
    <div className="py-xl flex justify-center">
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="secondary">Retroceder 15s</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Flecha izquierda</TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
);

export const Cerrado: Story = { render: pista };
export const Abierto: Story = { args: { open: true }, render: pista };
