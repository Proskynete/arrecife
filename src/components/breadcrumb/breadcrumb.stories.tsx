import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
import { Breadcrumb } from './index.tsx';

const meta = {
  title: 'Componentes/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: [
      { label: 'artículos', href: '/articulos' },
      { label: 'como-escalar-un-equipo-sin-romperlo' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  name: 'Básico',
  render: (args) => (
    <>
      <Breadcrumb {...args} />
      <Nota>
        El `~` es el home del sistema de archivos, no un icono de casa: por eso
        toda la ruta va en mono. Los separadores usan `border`, que es el token
        más tenue que todavía se lee como línea.
      </Nota>
      <Nota>
        El último tramo es la página actual, así que no es un enlace y lleva
        `aria-current="page"`. El `~` lleva `aria-label`, que si no un lector de
        pantalla anuncia una tilde suelta.
      </Nota>
    </>
  ),
};

export const Profundo: Story = {
  args: {
    items: [
      { label: 'cursos', href: '/cursos' },
      { label: 'arquitectura-frontend', href: '/cursos/arquitectura-frontend' },
      { label: 'modulo-3' },
    ],
  },
};
