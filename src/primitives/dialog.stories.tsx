import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../stories/utils.tsx';
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

const meta = { title: 'Primitives/Dialog', component: Dialog } satisfies Meta<typeof Dialog>;
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
          <Button variant="secondary">Mejor no</Button>
        </DialogClose>
        <Button>Cancelar suscripción</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const Closed: Story = { render: modal };
export const Open: Story = { args: { open: true }, render: modal };

export const NoInput: Story = {
  name: 'No entrance animation',
  args: { open: true },
  render: (args) => (
    <>
      {modal(args)}
      <Note>
        The modal appears where it will stay: it neither scales nor slides. The
        scrim is `brand.hull` at 70%, the same hull as the mascot's outline.
      </Note>
    </>
  ),
};
