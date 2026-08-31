import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import { Nota } from '../../stories/utils.tsx';
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
  title: 'Primitivos/Sheet',
  component: Sheet,
  argTypes: {},
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

type Lado = 'right' | 'left' | 'top' | 'bottom';

const panel = (args: Parameters<NonNullable<Story['render']>>[0], side: Lado = 'right') => (
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
          <Label htmlFor="codigo">Código</Label>
          <Input id="codigo" defaultValue="LANZAMIENTO25" />
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

export const Cerrado: Story = { render: (args) => panel(args) };

const abierto = {
  parameters: {
    a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Editar cupón' }));
  },
};

export const Derecha: Story = { ...abierto, render: (args) => panel(args, 'right') };
export const Izquierda: Story = { ...abierto, render: (args) => panel(args, 'left') };
export const Abajo: Story = { ...abierto, render: (args) => panel(args, 'bottom') };

export const LaExcepcion: Story = {
  ...abierto,
  name: 'La excepción de movimiento',
  render: (args) => (
    <>
      {panel(args)}
      <Nota>
        Es la segunda y última excepción a «nada de desplazamiento» del sistema, y
        se aprobó a sabiendas: un panel que entra desde un borde se desliza por
        definición — quieto sería un modal descentrado. Dura lo mismo y usa la
        misma curva que cualquier cambio de color, así que no introduce un tiempo
        nuevo, y va detrás de `motion-safe`.
      </Nota>
    </>
  ),
};
