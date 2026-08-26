import type { Meta, StoryObj } from '@storybook/react-vite';

import { Fila, Nota, Pila } from '../../stories/utils.tsx';
import { Avatar, AvatarFallback, AvatarImage } from './avatar.tsx';

const meta = { title: 'Primitivos/Avatar', component: Avatar } satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Iniciales: Story = {
  render: () => (
    <Fila>
      <Avatar size="sm"><AvatarFallback>EA</AvatarFallback></Avatar>
      <Avatar size="md"><AvatarFallback>EA</AvatarFallback></Avatar>
      <Avatar size="lg"><AvatarFallback>EA</AvatarFallback></Avatar>
      <Avatar size="xl"><AvatarFallback>EA</AvatarFallback></Avatar>
    </Fila>
  ),
};

export const ConImagen: Story = {
  name: 'Con imagen',
  render: () => (
    <Pila>
      <Fila>
        <Avatar size="lg">
          <AvatarImage src="/no-existe.jpg" alt="" />
          <AvatarFallback>EA</AvatarFallback>
        </Avatar>
      </Fila>
      <Nota>
        Aquí la imagen no carga a propósito: el respaldo de iniciales es lo que se
        ve mientras llega, y lo que queda si no llega nunca. Es un solo `Avatar`
        para todo — no hay un `brand/Avatar` aparte, porque tu foto es esto con
        otro `src`.
      </Nota>
    </Pila>
  ),
};
