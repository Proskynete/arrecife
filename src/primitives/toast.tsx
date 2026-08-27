import * as ToastPrimitive from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { Close } from '../lib/glyphs.tsx';

export const ToastProvider = ToastPrimitive.Provider;
export const ToastAction = ToastPrimitive.Action;

export function ToastViewport({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      className={cn(
        'gap-sm p-lg fixed right-0 bottom-0 z-50 flex max-h-screen w-full flex-col-reverse',
        'sm:max-w-[420px] sm:flex-col',
        className,
      )}
      {...props}
    />
  );
}

const toast = cva(
  [
    'gap-md p-md pr-10 relative flex w-full items-start justify-between',
    'rounded-card border bg-surface shadow-standard',
    'font-sans text-ui text-text-secondary',
  ],
  {
    variants: {
      variant: {
        neutral: 'border-border',
        success: 'border-success/40',
        error: 'border-error/40',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export type ToastProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Root> &
  VariantProps<typeof toast>;

/** Sin deslizamiento de entrada: el aviso aparece donde va a quedarse. */
export function Toast({ className, variant, children, ...props }: ToastProps) {
  return (
    <ToastPrimitive.Root className={cn(toast({ variant }), className)} {...props}>
      {children}
      <ToastPrimitive.Close
        aria-label="Cerrar"
        className={cn(
          'rounded-chip text-text-muted absolute top-3 right-3 flex size-7 cursor-pointer items-center justify-center',
          'transition-standard',
          'hover:bg-surface-raised hover:text-text-primary',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        )}
      >
        <Close />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

export function ToastTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      className={cn('text-text-primary mb-1 font-medium', className)}
      {...props}
    />
  );
}

export function ToastDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ToastPrimitive.Description>) {
  return <ToastPrimitive.Description className={cn('max-w-measure', className)} {...props} />;
}
