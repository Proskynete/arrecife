import type { ComponentProps } from 'react';

import { cn } from '../lib/cn.ts';

/**
 * `ComponentProps` and not `ComponentPropsWithoutRef`, and the difference is a
 * bug and not a preference.
 *
 * `WithoutRef` is what React 18 required: `ref` was not a prop there, it arrived
 * through `forwardRef`, and a type that included it promised something the
 * component could not deliver. React 19 passes `ref` as an ordinary prop, so the
 * `...props` spread below already forwards it — the type was the only thing
 * still saying otherwise. It WORKED at runtime and failed at `tsc` with
 * «Property 'ref' does not exist», which is the worst half of the two: the
 * escape route is a cast or a wrapper element, and both are detours around a
 * type rather than around a behaviour.
 *
 * `blog-content-manager` took the second one — its Giphy dialog focuses the
 * search field 50 ms after opening, because Radix claims focus first, and it had
 * to take the `ref` on the wrapping `div` and reach the input with a
 * `querySelector`.
 *
 * The same applies to every primitive that wraps a native control you can focus:
 * `Textarea`, `Label` and `DateField` change with it. See `docs/decisions/`
 * § 41.
 */
export type InputProps = ComponentProps<'input'> & {
  /** Marks the control as invalid and tints the border. */
  invalid?: boolean;
};

export function Input({ className, invalid = false, ...props }: InputProps) {
  return (
    <input
      data-invalid={invalid || undefined}
      aria-invalid={invalid || undefined}
      className={cn(
        'h-10 w-full px-step-sm',
        'rounded-control border border-border bg-surface',
        'font-sans text-ui text-text-primary placeholder:text-text-muted',
        'transition-standard',
        'hover:border-hairline-hover',
        'focus-visible:border-accent focus-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[invalid]:border-error data-[invalid]:focus-visible:outline-error',
        'file:mr-step-sm file:border-0 file:bg-transparent file:font-sans file:text-label file:text-text-secondary',
        className,
      )}
      {...props}
    />
  );
}
