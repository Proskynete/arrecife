import type { Meta, StoryObj } from '@storybook/react-vite';

import { Fila, Nota, Pila } from '../../stories/utils.tsx';
import { Avatar, AvatarFallback, AvatarImage, AvatarUpload } from './avatar.tsx';

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

export const Subida: Story = {
  name: 'AvatarUpload',
  render: () => (
    <div>
      <Fila>
        <AvatarUpload size="lg" fallback="EA" />
        <AvatarUpload size="xl" fallback="EA" />
        <AvatarUpload size="lg" fallback="EA" disabled />
      </Fila>
      <Nota>
        La insignia está SIEMPRE visible, no aparece al pasar el ratón. El velo a
        hover es más limpio y es de escritorio: en táctil no hay hover, así que el
        control no existiría hasta que alguien adivine que la foto se toca.
      </Nota>
      <Nota>
        Es un `label` con un `input type="file"` oculto dentro, no un botón que
        dispara un click sintético. El input real trae el diálogo del sistema, el
        arrastrar-y-soltar y el foco por teclado.
      </Nota>
      <Nota>
        La previsualización es local y no espera a la subida: emite
        `onSelectFile(File)` y el `POST` lo hace el proyecto, como en
        `NewsletterForm`. El `objectURL` se revoca al cambiar y al desmontar.
      </Nota>
    </div>
  ),
};

export const SubidaFoco: Story = {
  name: 'AvatarUpload · focus',
  parameters: { pseudo: { focusVisible: true } },
  render: () => <AvatarUpload size="lg" fallback="EA" />,
};
