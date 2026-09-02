import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { Close } from '../lib/glyphs.tsx';

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

/**
 * The second and last exception to «no displacement», approved knowingly: a
 * panel entering from an edge slides by definition, and held still it would be
 * an off-centre modal.
 *
 * It lasts `--duration-standard` with `--ease-standard`, that is, the same time
 * and the same curve as any color change in the system, so it introduces no new
 * timing. It sits behind `motion-safe`: whoever asked for less motion sees it
 * appear without sliding.
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
          'motion-safe:data-[state=open]:slide-in-right',
          'motion-safe:data-[state=closed]:slide-out-right',
        ],
        left: [
          'inset-y-0 left-0 h-full w-3/4 max-w-content border-r',
          'motion-safe:data-[state=open]:slide-in-left',
          'motion-safe:data-[state=closed]:slide-out-left',
        ],
        top: [
          'inset-x-0 top-0 border-b',
          'motion-safe:data-[state=open]:slide-in-top',
          'motion-safe:data-[state=closed]:slide-out-top',
        ],
        bottom: [
          'inset-x-0 bottom-0 border-t',
          'motion-safe:data-[state=open]:slide-in-bottom',
          'motion-safe:data-[state=closed]:slide-out-bottom',
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
            'rounded-chip text-text-muted absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center',
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
      className={cn('border-hairline gap-step-xs p-step-lg flex flex-col border-b pr-12', className)}
      {...props}
    />
  );
}

export function SheetBody({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('p-step-lg flex-1 overflow-y-auto', className)} {...props} />;
}

export function SheetFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('border-hairline gap-step-sm p-step-lg flex flex-wrap justify-end border-t', className)}
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
