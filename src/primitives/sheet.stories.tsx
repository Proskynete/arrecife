import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import { Note } from '../../stories/utils.tsx';
import { Button } from './button.tsx';
import { Input } from './input.tsx';
import { Label } from './label.tsx';
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet.tsx';

const meta = {
  title: 'Primitives/Sheet',
  component: Sheet,
  argTypes: {},
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

type Side = 'right' | 'left' | 'top' | 'bottom';

const panel = (args: Parameters<NonNullable<Story['render']>>[0], side: Side = 'right') => (
  <Sheet {...args}>
    <SheetTrigger asChild>
      <Button variant="secondary">Editar cupón</Button>
    </SheetTrigger>
    <SheetContent side={side}>
      <SheetHeader>
        <SheetTitle>Editar cupón</SheetTitle>
        <SheetDescription>Los cambios se aplican a los canjes futuros, no a los ya hechos.</SheetDescription>
      </SheetHeader>
      <SheetBody>
        <div className="gap-step-xs flex flex-col">
          <Label htmlFor="code">Código</Label>
          <Input id="code" defaultValue="LANZAMIENTO25" />
        </div>
      </SheetBody>
      <SheetFooter>
        <SheetClose asChild>
          <Button variant="secondary">Cancelar</Button>
        </SheetClose>
        <Button>Guardar</Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);

export const Closed: Story = { render: (args) => panel(args) };

const open = {
  parameters: {
    a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Editar cupón' }));
  },
};

export const Right: Story = { ...open, render: (args) => panel(args, 'right') };
export const Left: Story = { ...open, render: (args) => panel(args, 'left') };
export const Bottom: Story = { ...open, render: (args) => panel(args, 'bottom') };

export const TheException: Story = {
  ...open,
  name: 'The motion exception',
  render: (args) => (
    <>
      {panel(args)}
      <Note>
        It is the system's second and last exception to «no displacement», and it
        was approved knowingly: a panel entering from an edge slides by definition
        — held still it would be an off-centre modal. It lasts the same and uses
        the same curve as any color change, so it introduces no new timing, and it
        sits behind `motion-safe`.
      </Note>
    </>
  ),
};
