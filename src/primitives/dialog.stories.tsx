import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../stories/utils.tsx';
import { Button } from './button.tsx';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog.tsx';

const meta = { title: 'Primitivos/Dialog', component: Dialog } satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

const modal = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <Dialog {...args}>
    <DialogTrigger asChild>
      <Button variant="secondary">Abrir</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cancelar la suscripción</DialogTitle>
        <DialogDescription>
          Pierdes el acceso al curso al final del período que ya pagaste. Los apuntes
          descargados se quedan contigo.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Mejor no</Button>
        </DialogClose>
        <Button variant="danger">Cancelar suscripción</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const Cerrado: Story = { render: modal };
export const Abierto: Story = { args: { open: true }, render: modal };

export const SinEntrada: Story = {
  name: 'Sin animación de entrada',
  args: { open: true },
  render: (args) => (
    <>
      {modal(args)}
      <Nota>
        El modal aparece donde va a quedarse: no escala ni se desliza. El velo es
        `brand.hull` al 70%, que es el mismo casco del contorno de la mascota.
      </Nota>
    </>
  ),
};
