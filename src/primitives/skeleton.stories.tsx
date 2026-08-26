import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota, Pila } from '../../stories/utils.tsx';
import { Skeleton } from './skeleton.tsx';

const meta = { title: 'Primitivos/Skeleton', component: Skeleton } satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Pila>
      <div className="rounded-card border-hairline p-md gap-sm flex flex-col border">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Nota>
        Sin pulso ni barrido. Un bloque en `surfaceRaised` ya dice «aquí va a haber
        algo» sin pedirle atención al ojo, y el sistema no anima.
      </Nota>
    </Pila>
  ),
};
