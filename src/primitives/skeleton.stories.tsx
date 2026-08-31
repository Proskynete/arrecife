import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota, Pila } from '../../stories/utils.tsx';
import { Card } from './card.tsx';
import { Skeleton } from './skeleton.tsx';

const meta = { title: 'Primitivos/Skeleton', component: Skeleton } satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tarjeta: Story = {
  name: 'Carga de tarjeta',
  render: () => (
    <>
      <Pila>
        <Card className="p-step-lg gap-step-sm flex flex-col">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </Card>
      </Pila>
      <Nota>
        Barrido de 1.4s lineal. Es la tercera y última excepción a «el sistema no
        anima», junto al spinner del botón y el panel lateral: las tres son
        realimentación de progreso y no de estado. Un bloque quieto y un bloque
        que nunca va a cargar se ven exactamente igual.
      </Nota>
      <Nota>
        Va detrás de `motion-safe`, así que se apaga solo para quien pidió menos
        movimiento — y ahí queda el bloque en `surfaceRaised`, que sigue diciendo
        qué forma tiene lo que viene.
      </Nota>
    </>
  ),
};

export const Quieto: Story = {
  name: 'Sin barrido',
  render: () => (
    <>
      <Pila>
        <div className="gap-step-xs flex flex-col">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} still className="h-9 w-full" />
          ))}
        </div>
      </Pila>
      <Nota>
        `still` lo apaga a mano. Veinte filas de tabla barriendo a la vez son un
        estroboscopio, no una carga.
      </Nota>
    </>
  ),
};
