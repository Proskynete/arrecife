import type { Meta, StoryObj } from '@storybook/react-vite';

import { Fila, Nota } from '../../stories/utils.tsx';
import { Badge } from './badge.tsx';

const meta = { title: 'Primitivos/Badge', component: Badge } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTES = ['neutral', 'accent', 'warm', 'success', 'warning', 'error'] as const;

export const Variantes: Story = {
  render: () => (
    <>
      <Fila>
        {VARIANTES.map((v) => (
          <Badge key={v} variant={v}>
            {v}
          </Badge>
        ))}
      </Fila>
      <Nota>
        Mono, doce píxeles, tracking 0.12em y versalitas: es la escala `eyebrow`.
        El badge es metadato, no un botón — no tiene hover ni foco porque no se
        pulsa.
      </Nota>
    </>
  ),
};
