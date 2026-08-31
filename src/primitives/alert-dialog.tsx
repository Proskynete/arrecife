import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { buttonVariants } from './button.tsx';

/**
 * La confirmación destructiva. NO es un `Dialog` con otro texto, y por eso está
 * en su propio archivo y sobre su propia primitiva de Radix.
 *
 * Tres diferencias, y las tres importan en el momento en que alguien va a
 * borrar un artículo:
 *
 *   1. El rol es `alertdialog`, no `dialog`. Un lector de pantalla lo anuncia
 *      con la descripción incluida, sin esperar a que se navegue hasta ella.
 *   2. El foco inicial va al CANCELAR, no al primer elemento. Quien pulsa Enter
 *      por inercia no borra nada. Radix lo hace solo si el cancelar existe, y
 *      por eso `AlertDialogCancel` no es opcional en la práctica.
 *   3. NO se cierra al pulsar fuera ni tiene aspa. Salir de una confirmación es
 *      una decisión, no un descuido: hay que decir que no.
 *
 * El botón de confirmar NO es rojo. El sistema no tiene variante de peligro
 * —`Button` lo dice explícito— y el error vive en los avisos y en la validación
 * de campo, no en un botón. Lo que comunica la gravedad es el texto: «Borrar el
 * artículo», no «Aceptar».
 */
export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

export function AlertDialogOverlay({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      className={cn('bg-brand-hull/70 fixed inset-0 z-50', className)}
      {...props}
    />
  );
}

/** Sin entrada animada, igual que `Dialog`: aparece donde va a quedarse. */
export function AlertDialogContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 z-50 w-full max-w-content -translate-x-1/2 -translate-y-1/2',
          'gap-step-md p-step-lg flex flex-col',
          'rounded-panel border-border bg-surface shadow-standard border',
          'text-text-primary font-sans',
          className,
        )}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  );
}

export function AlertDialogHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('gap-step-xs flex flex-col', className)} {...props} />;
}

/**
 * Cancelar a la IZQUIERDA de confirmar en escritorio y ABAJO en móvil, que es lo
 * que da `flex-col-reverse`: el orden del DOM pone cancelar primero —es donde va
 * el foco— y en columna el dedo lo encuentra donde toca sin cambiar la
 * tabulación.
 */
export function AlertDialogFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('gap-step-sm flex flex-col-reverse sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

export function AlertDialogTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn('text-h3 font-display text-text-primary', className)}
      {...props}
    />
  );
}

/**
 * Lo que se pierde, dicho entero. Es lo que el rol `alertdialog` hace que se
 * anuncie de entrada, así que aquí no va «esta acción no se puede deshacer»
 * suelto: va qué se borra y qué se lleva por delante.
 */
export function AlertDialogDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn('text-ui text-text-secondary max-w-measure', className)}
      {...props}
    />
  );
}

/** El que se lleva el foco al abrir. */
export function AlertDialogCancel({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: 'secondary' }), className)}
      {...props}
    />
  );
}

export function AlertDialogAction({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants({ variant: 'primary' }), className)}
      {...props}
    />
  );
}
