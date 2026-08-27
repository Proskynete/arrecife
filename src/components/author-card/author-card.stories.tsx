import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota, Pila } from '../../../stories/utils.tsx';
import { Button } from '../../primitives/button.tsx';
import { AuthorCard } from './index.tsx';

const meta = {
  title: 'Componentes/AuthorCard',
  component: AuthorCard,
  args: { name: 'Eduardo Álvarez', role: 'Technical Lead · Chile' },
} satisfies Meta<typeof AuthorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  name: 'Básico',
  render: (args) => (
    <>
      <Pila>
        <AuthorCard {...args} />
      </Pila>
      <Nota>
        Tres datos: avatar 52px, nombre 15/500 y el rol en mono muted. El rol va
        en mono porque es un dato —cargo y país—, no una frase.
      </Nota>
      <Nota>
        No recibe cara de mascota, y no es un descuido: es la misma regla que
        `PageHeader`. Una cara aquí sería humor justo donde el lector está
        decidiendo si el autor sabe de lo que habla.
      </Nota>
    </>
  ),
};

export const ConBio: Story = {
  name: 'Con bio y acción',
  render: (args) => (
    <Pila>
      <AuthorCard
        {...args}
        bio="Trabajo con equipos que crecieron más rápido que su arquitectura. Escribo sobre liderazgo técnico, plataforma y la era de la IA."
        action={<Button variant="tertiary">./hablemos →</Button>}
      />
    </Pila>
  ),
};
