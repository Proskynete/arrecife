import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { buttonVariants } from '../variants/button.ts';

/**
 * The destructive confirmation. It is NOT a `Dialog` with different text, which
 * is why it lives in its own file and on its own Radix primitive.
 *
 * Three differences, and all three matter at the moment somebody is about to
 * delete an article:
 *
 *   1. The role is `alertdialog`, not `dialog`. A screen reader announces it
 *      with the description included, without waiting for you to navigate to it.
 *   2. Initial focus goes to CANCEL, not to the first element. Whoever hits
 *      Enter out of inertia deletes nothing. Radix does this on its own only if
 *      the cancel exists, which is why `AlertDialogCancel` is not optional in
 *      practice.
 *   3. It does NOT close on outside click and has no X. Leaving a confirmation
 *      is a decision, not a slip: you have to say no.
 *
 * The confirm button is NOT red, and since 0.7.0 that is a choice and no longer
 * the absence of an option: `Button` has `destructive`, and here it is still not
 * used. Everything above already carries the gravity — a title that says what is
 * about to happen, focus on cancel, no closing by clicking outside — and a red
 * button on top of that is shouting. What communicates the gravity is the text:
 * «Borrar el artículo», not «Aceptar».
 *
 * `destructive` is for the destructive button that has none of that around it:
 * a table row, a toolbar. See `docs/decisions.md` § 21.
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

/** No entrance animation, same as `Dialog`: it appears where it will stay. */
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
 * Cancel to the LEFT of confirm on desktop and BELOW it on mobile, which is what
 * `flex-col-reverse` gives: the DOM order puts cancel first — that is where focus
 * goes — and in a column the thumb finds it where it should be without changing
 * the tab order.
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
 * What is lost, spelled out. The `alertdialog` role makes this get announced up
 * front, so «this action cannot be undone» does not go here on its own: what
 * goes here is what gets deleted and what it takes down with it.
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

/** The one that takes focus on open. */
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
