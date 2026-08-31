import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../stories/utils.tsx';
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
  title: 'Primitivos/AlertDialog',
  component: AlertDialog,
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const confirmacion = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <AlertDialog {...args}>
    <AlertDialogTrigger asChild>
      <Button variant="secondary">Borrar el artículo</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Borrar «Escalar con criterio»</AlertDialogTitle>
        <AlertDialogDescription>
          Se borra el artículo, sus dos borradores y la imagen de portada. Los
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

export const Cerrado: Story = { render: confirmacion };

export const Abierto: Story = {
  args: { open: true },
  render: (args) => (
    <>
      {confirmacion(args)}
      <Nota>
        El foco entra en «Mejor no», no en el botón de borrar. Quien pulsa Enter
        por inercia no pierde nada.
      </Nota>
      <Nota>
        No hay aspa y no se cierra al pulsar fuera. Salir de una confirmación es
        una decisión: hay que decir que no.
      </Nota>
      <Nota>
        El botón de confirmar NO es rojo — el sistema no tiene variante de
        peligro. Lo que comunica la gravedad es el texto: dice qué hace, no
        «Aceptar».
      </Nota>
    </>
  ),
};

export const Destructivo: Story = {
  name: 'La descripción dice qué se pierde',
  args: { open: true },
  render: (args) => (
    <>
      {confirmacion(args)}
      <Nota>
        El rol es `alertdialog`: la descripción se anuncia al abrir, sin esperar
        a que se navegue hasta ella. Por eso no dice «esta acción no se puede
        deshacer» y ya — enumera qué se lleva por delante.
      </Nota>
    </>
  ),
};
