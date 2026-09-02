import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

export type DateFieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  invalid?: boolean | undefined;
  /** Adds the time to the field. It is the native `datetime-local`. */
  withTime?: boolean | undefined;
};

/**
 * A date field on the native control, not on a calendar of our own.
 *
 * It is a deliberate decision: `react-day-picker` would have been the library's
 * first heavy dependency, with its own CSS and its own month-change animation —
 * which the system does not allow. The native control brings the OS keyboard,
 * the format matching the user's language and screen-reader support for free,
 * which is more than a bespoke calendar gives without work.
 *
 * It covers picking a date inside a form. A navigable month calendar is a
 * different thing and lives in the project that needs it.
 *
 * The native picker icon is tinted through `color-scheme`, which is the only
 * thing the browser lets you control: it is tied to the active mode so no little
 * white square shows up over abyss.
 */
export function DateField({
  className,
  invalid = false,
  withTime = false,
  ...props
}: DateFieldProps) {
  return (
    <input
      type={withTime ? 'datetime-local' : 'date'}
      data-invalid={invalid || undefined}
      aria-invalid={invalid || undefined}
      className={cn(
        'px-step-sm h-10 w-full',
        'rounded-control border-border bg-surface border',
        'font-mono text-ui text-text-primary',
        'transition-standard',
        'hover:border-hairline-hover',
        'focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[invalid]:border-error data-[invalid]:focus-visible:outline-error',
        // The native indicator inherits the active theme's scheme.
        'scheme-light dark:scheme-dark [&::-webkit-calendar-picker-indicator]:cursor-pointer',
        className,
      )}
      {...props}
    />
  );
}
