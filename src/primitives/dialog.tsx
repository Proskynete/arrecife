import * as DialogPrimitive from '@radix-ui/react-dialog';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { Close } from '../lib/glyphs.tsx';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn('bg-brand-hull/70 fixed inset-0 z-50', className)}
      {...props}
    />
  );
}

/** Sin entrada animada: no hay escala ni desplazamiento en el sistema. */
export function DialogContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 z-50 w-full max-w-content -translate-x-1/2 -translate-y-1/2',
          'gap-md p-lg flex flex-col',
          'rounded-panel border-border bg-surface shadow-standard border',
          'text-text-primary font-sans',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="Cerrar"
          className={cn(
            'rounded-chip text-text-muted absolute top-4 right-4 flex size-8 items-center justify-center',
            'transition-standard',
            'hover:bg-surface-raised hover:text-text-primary',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          )}
        >
          <Close />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('gap-xs flex flex-col pr-8', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('gap-sm flex flex-col-reverse sm:flex-row sm:justify-end', className)} {...props} />
  );
}

export function DialogTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('text-h3 font-display text-text-primary', className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-ui text-text-secondary max-w-measure', className)}
      {...props}
    />
  );
}
