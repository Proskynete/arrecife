import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { Close } from '../lib/glyphs.tsx';

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

/**
 * La segunda y última excepción a «nada de desplazamiento», aprobada a
 * sabiendas: un panel que entra desde un borde se desliza por definición, y
 * quieto sería un modal descentrado.
 *
 * Dura `--duration-standard` con `--ease-standard`, o sea lo mismo y con la
 * misma curva que cualquier cambio de color del sistema, así que no introduce
 * un tiempo nuevo. Va detrás de `motion-safe`: quien pidió menos movimiento lo
 * ve aparecer sin deslizarse.
 */
const panel = cva(
  [
    'bg-surface border-border shadow-standard fixed z-50 flex flex-col',
    'text-text-primary font-sans outline-none',
  ],
  {
    variants: {
      side: {
        right: [
          'inset-y-0 right-0 h-full w-3/4 max-w-content border-l',
          'motion-safe:data-[state=open]:deslizar-entra-derecha',
          'motion-safe:data-[state=closed]:deslizar-sale-derecha',
        ],
        left: [
          'inset-y-0 left-0 h-full w-3/4 max-w-content border-r',
          'motion-safe:data-[state=open]:deslizar-entra-izquierda',
          'motion-safe:data-[state=closed]:deslizar-sale-izquierda',
        ],
        top: [
          'inset-x-0 top-0 border-b',
          'motion-safe:data-[state=open]:deslizar-entra-arriba',
          'motion-safe:data-[state=closed]:deslizar-sale-arriba',
        ],
        bottom: [
          'inset-x-0 bottom-0 border-t',
          'motion-safe:data-[state=open]:deslizar-entra-abajo',
          'motion-safe:data-[state=closed]:deslizar-sale-abajo',
        ],
      },
    },
    defaultVariants: { side: 'right' },
  },
);

export type SheetContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
  VariantProps<typeof panel>;

export function SheetContent({ className, side, children, ...props }: SheetContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="bg-brand-hull/70 fixed inset-0 z-50" />
      <DialogPrimitive.Content className={cn(panel({ side }), className)} {...props}>
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

export function SheetHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('border-hairline gap-xs p-lg flex flex-col border-b pr-12', className)}
      {...props}
    />
  );
}

export function SheetBody({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('p-lg flex-1 overflow-y-auto', className)} {...props} />;
}

export function SheetFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('border-hairline gap-sm p-lg flex flex-wrap justify-end border-t', className)}
      {...props}
    />
  );
}

export function SheetTitle({
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

export function SheetDescription({
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
