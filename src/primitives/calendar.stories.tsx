import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import { Nota, Pila } from '../../stories/utils.tsx';
import { Button } from './button.tsx';
import { Calendar } from './calendar.tsx';
import { Popover, PopoverContent, PopoverTrigger } from './popover.tsx';

const meta = {
  title: 'Primitivos/Calendar',
  component: Calendar,
  argTypes: {
    fullWidth: {
      control: 'boolean',
      description: 'Ocupa todo el ancho del contenedor, repartiendo las celdas a partes iguales.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Fecha fija: una story no puede depender de hoy o cambia sola cada día. */
const MES = new Date(2026, 2, 1);
const DIA = new Date(2026, 2, 14);

export const Default: Story = {
  render: () => (
    <Pila>
      <Calendar mode="single" selected={DIA} defaultMonth={MES} />
      <Nota>
        El cambio de mes no se desliza: `animate` se queda apagado. Los días se
        marcan con color y borde, como el resto del sistema. El idioma va en
        español por defecto y se cambia con `locale`.
      </Nota>
    </Pila>
  ),
};

export const Rango: Story = {
  render: () => (
    <Pila>
      <Calendar
        mode="range"
        defaultMonth={MES}
        selected={{ from: new Date(2026, 2, 9), to: new Date(2026, 2, 20) }}
      />
      <Nota>Extremos en bioluz, el tramo intermedio en `surfaceRaised`.</Nota>
    </Pila>
  ),
};

export const DosMeses: Story = {
  name: 'Dos meses',
  render: () => <Calendar mode="single" numberOfMonths={2} defaultMonth={MES} selected={DIA} />,
};

export const AnchoCompleto: Story = {
  name: 'Ancho completo',
  render: () => (
    <div className="gap-lg flex flex-col">
      <div className="border-hairline rounded-card p-md border">
        <Calendar fullWidth mode="single" selected={DIA} defaultMonth={MES} />
      </div>
      <Nota>
        `fullWidth` estira el calendario hasta el ancho de su contenedor y reparte
        las celdas a partes iguales. Es la vista de mes de un planificador. Sin
        él, el calendario mide lo que miden sus celdas, que es lo que quieres
        dentro de un `Popover` — estirarlo ahí dejaría un globo enorme.
      </Nota>
    </div>
  ),
};

export const AnchoCompletoDosMeses: Story = {
  name: 'Ancho completo, dos meses',
  render: () => (
    <div className="border-hairline rounded-card p-md border">
      <Calendar fullWidth mode="range" numberOfMonths={2} defaultMonth={MES}
        selected={{ from: new Date(2026, 2, 9), to: new Date(2026, 3, 2) }} />
    </div>
  ),
};

function SelectorDeFecha() {
  const [fecha, setFecha] = useState<Date | undefined>(DIA);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          {fecha ? fecha.toLocaleDateString('es') : 'Elegir fecha'}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" aria-label="Elegir fecha" className="w-auto p-sm">
        <Calendar mode="single" selected={fecha} onSelect={setFecha} defaultMonth={MES} />
      </PopoverContent>
    </Popover>
  );
}

export const DentroDeUnPopover: Story = {
  name: 'Dentro de un Popover',
  parameters: {
    a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } },
  },
  render: () => (
    <>
      <SelectorDeFecha />
      <Nota>
        No hay un componente `DatePicker`: son `Popover` más `Calendar`, y son
        cinco líneas. Un tercer componente que solo pega dos que ya existen es
        superficie de API que hay que mantener sin ganar nada.
      </Nota>
    </>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button'));
  },
};
