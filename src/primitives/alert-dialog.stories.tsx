import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../stories/utils.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog.tsx';
import { Button } from './button.tsx';

const meta = {
  title: 'Primitives/AlertDialog',
  component: AlertDialog,
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const confirmation = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <AlertDialog {...args}>
    <AlertDialogTrigger asChild>
      <Button variant="secondary">Borrar el artículo</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Borrar «Escalar con criterio»</AlertDialogTitle>
        <AlertDialogDescription>
          Se borra el artículo, sus two borradores y la imagen de portada. Los
          enlaces que apunten a él van a dar un 404. No se puede deshacer.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Mejor no</AlertDialogCancel>
        <AlertDialogAction>Borrar el artículo</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const Closed: Story = { render: confirmation };

export const Open: Story = {
  args: { open: true },
  render: (args) => (
    <>
      {confirmation(args)}
      <Note>
        Focus lands on «Mejor no», not on the delete button. Whoever hits Enter out
        of inertia loses nothing.
      </Note>
      <Note>
        There is no X and it does not close on outside click. Leaving a
        confirmation is a decision: you have to say no.
      </Note>
      <Note>
        The confirm button is NOT red, and since 0.6.0 that is a choice rather
        than the absence of an option: `Button` has `destructive` and this does
        not use it. Everything above already carries the gravity, and a red button
        on top of it is shouting. What communicates it is the text: it says what
        it does, not «Aceptar». See `docs/decisions.md` § 21.
      </Note>
    </>
  ),
};

export const Destructive: Story = {
  name: 'The description says what is lost',
  args: { open: true },
  render: (args) => (
    <>
      {confirmation(args)}
      <Note>
        The role is `alertdialog`: the description is announced on open, without
        waiting for anyone to navigate to it. Which is why it does not just say
        «this cannot be undone» — it lists what gets taken down with it.
      </Note>
    </>
  ),
};
